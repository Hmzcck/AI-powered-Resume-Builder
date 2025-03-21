import { create } from "zustand";
import type { Section, SectionType } from "@/types/resume/sections";
import { v4 as uuidv4 } from "uuid";
import { resumeService } from "@/services/resume-service";

type ResumeStore = {
  resumeId: string | null;
  title: string;
  sections: Section[];
  activeSection: string | null;
  isLoading: boolean;
  setResumeId: (id: string) => void;
  setTitle: (title: string) => void;
  setSections: (sections: Section[]) => void;
  setActiveSection: (sectionId: string) => void;
  updateSection: (sectionId: string, content: string) => void;
  updateSectionHeader: (sectionId: string, header: string) => void;
  addSection: (type: SectionType) => void;
  reorderSections: (oldIndex: number, newIndex: number) => void;
  initializeEmptyResume: () => void;
  loadResume: (id: string) => Promise<void>;
  updateFromAIContent: (
    aiGeneratedSections: Array<{
      type: SectionType;
      header: string;
      content: string;
    }>
  ) => void;
};

const defaultSections: Section[] = [
  {
    id: uuidv4(),
    type: "personal",
    header: "Personal Information",
    content: "",
  },
  {
    id: uuidv4(),
    type: "summary",
    header: "Professional Summary",
    content: "",
  },
  {
    id: uuidv4(),
    type: "experience",
    header: "Work Experience",
    content: "",
  },
  {
    id: uuidv4(),
    type: "education",
    header: "Education",
    content: "",
  },
  {
    id: uuidv4(),
    type: "skills",
    header: "Technical Skills",
    content: "",
  },
  {
    id: uuidv4(),
    type: "projects",
    header: "Projects",
    content: "",
  },
  {
    id: uuidv4(),
    type: "certifications",
    header: "Certifications",
    content: "",
  },
  {
    id: uuidv4(),
    type: "languages",
    header: "Languages",
    content: "",
  },
  {
    id: uuidv4(),
    type: "awards",
    header: "Awards & Achievements",
    content: "",
  },
  {
    id: uuidv4(),
    type: "references",
    header: "References",
    content: "",
  },
  {
    id: uuidv4(),
    type: "publications",
    header: "Publications",
    content: "",
  },
];

export const useResumeStore = create<ResumeStore>((set) => ({
  resumeId: null,
  title: "",
  sections: defaultSections,
  activeSection: null,
  isLoading: false,

  setResumeId: (id: string) => set({ resumeId: id }),

  setTitle: (title: string) => set({ title }),

  setSections: (sections: Section[]) => set({ sections }),

  updateFromAIContent: (
    aiGeneratedSections: Array<{
      type: SectionType;
      header: string;
      content: string;
    }>
  ) => {
    try {
      if (!Array.isArray(aiGeneratedSections)) {
        console.error(
          "aiGeneratedSections is not an array:",
          aiGeneratedSections
        );
        throw new Error("aiGeneratedSections must be an array");
      }

      console.log("Updating with AI sections:", aiGeneratedSections);

      set((state) => {
        const updatedSections = state.sections.map((section) => {
          // Type assertion to help TypeScript understand the array type
          const aiSection = (
            aiGeneratedSections as Array<{
              type: SectionType;
              header: string;
              content: string;
            }>
          ).find((s) => s.type === section.type);

          if (aiSection) {
            return {
              ...section,
              header: aiSection.header || section.header,
              content: aiSection.content || section.content,
            };
          }
          return section;
        });

        return { sections: updatedSections };
      });
    } catch (error) {
      console.error("Error updating from AI content:", error);
      throw error;
    }
  },

  setActiveSection: (sectionId) => set({ activeSection: sectionId }),

  reorderSections: (oldIndex: number, newIndex: number) =>
    set((state) => {
      const sections = [...state.sections];
      const [removed] = sections.splice(oldIndex, 1);
      sections.splice(newIndex, 0, removed);
      return { sections };
    }),

  updateSectionHeader: (sectionId, header) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId ? { ...section, header } : section
      ),
    })),

  updateSection: (sectionId, content) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId ? { ...section, content } : section
      ),
    })),

  addSection: (type) =>
    set((state) => ({
      sections: [
        ...state.sections,
        {
          id: uuidv4(),
          type,
          header: "New Section",
          content: "",
        },
      ],
    })),

  initializeEmptyResume: () => {
    set({
      resumeId: null,
      title: "",
      sections: defaultSections.map((section) => ({
        ...section,
        id: uuidv4(),
      })),
      activeSection: null,
    });
  },

  loadResume: async (id: string) => {
    // Set initial loading state
    set({ isLoading: true });

    try {
      // Initialize all sections as loading
      set(() => ({
        resumeId: id,
        sections: defaultSections.map((section) => ({
          ...section,
          id: uuidv4(),
          content: "",
          isLoading: true,
        })),
      }));

      // Extract resume data from response structure
      const response = await resumeService.getResumeById(id);

      if (!response.ok) {
        console.error("Failed to load resume:", response.error);
        throw new Error("Failed to load resume");
      }

      const resume = response.resume;

      if (!resume || typeof resume !== "object") {
        console.warn("Invalid resume data received:", resume);
        throw new Error("Resume data not found in response");
      }

      // Parse the content string to get the sections array
      let contentSections;
      try {
        contentSections = JSON.parse(resume.content);
        console.log("contentSections", contentSections);
        if (!Array.isArray(contentSections)) {
          throw new Error("Resume content is not in the expected array format");
        }
      } catch (err) {
        console.error("Error parsing resume content:", err);
        throw new Error("Failed to parse resume content");
      }
      // Map the loaded sections to the default sections to preserve type information
      const sectionsWithIds = defaultSections.map((defaultSection) => {
        const loadedSection = contentSections.find(
          (s: { type: SectionType }) => s.type === defaultSection.type
        );

        if (loadedSection) {
          return {
            ...defaultSection,
            id: uuidv4(),
            header: loadedSection.header || defaultSection.header,
            content: loadedSection.content || "",
          };
        }
        return {
          ...defaultSection,
          id: uuidv4(),
        };
      });

      // Ensure all required section types exist
      const requiredTypes = [
        "personal",
        "summary",
        "experience",
        "education",
      ] as const;
      for (const type of requiredTypes) {
        if (!sectionsWithIds.some((s) => s.type === type)) {
          const defaultSection = defaultSections.find((s) => s.type === type);
          if (defaultSection) {
            sectionsWithIds.unshift({
              ...defaultSection,
              id: uuidv4(),
            });
          }
        }
      }

      interface LoadedSection {
        type: SectionType;
        header: string;
        content: string;
      }

      // Load each section individually with a delay
      const loadSectionContent = async (sections: LoadedSection[]) => {
        const delay = 200; // 200ms delay between each section

        for (const loadedSection of sections) {
          await new Promise((resolve) => setTimeout(resolve, delay));

          set((state) => ({
            sections: state.sections.map((section) => {
              if (section.type === loadedSection.type) {
                return {
                  ...section,
                  header: loadedSection.header || section.header,
                  content: loadedSection.content || "",
                  isLoading: false,
                };
              }
              return section;
            }),
          }));
        }
      };

      set({ title: resume.title || "" });
      await loadSectionContent(contentSections);

      // Only set overall loading to false after all sections are done
      set((state) => ({
        isLoading: false,
        sections: state.sections.map((section) => ({
          ...section,
          isLoading: false,
        })),
      }));
    } catch (error) {
      console.error("Error loading resume:", error);
      set({ isLoading: false });
      throw error;
    }
  },
}));
