import { create } from "zustand";
import { SectionType } from "@/types/resume/sections";
import {
  ResumeSection,
  PersonalSection,
  SummarySection,
  ExperienceSection,
  EducationSection,
  SkillsSection,
  ProjectsSection,
  CertificationsSection,
  LanguagesSection,
  AwardsSection,
  ReferencesSection,
  PublicationsSection,
} from "@/types/resume/models";
import { v4 as uuidv4 } from "uuid";
import { resumeService } from "@/services/resume-service";

type ResumeStore = {
  resumeId: string | null;
  title: string;
  sections: ResumeSection[];
  activeSection: string | null;
  isLoading: boolean;
  setResumeId: (id: string) => void;
  setTitle: (title: string) => void;
  setSections: (sections: ResumeSection[]) => void;
  setActiveSection: (sectionId: string) => void;
  updateSection: <T extends ResumeSection>(
    sectionId: string,
    content: T["content"] | string
  ) => void;
  updateSectionHeader: (sectionId: string, header: string) => void;
  addSection: (type: SectionType) => void;
  reorderSections: (oldIndex: number, newIndex: number) => void;
  initializeEmptyResume: () => void;
  loadResume: (id: string) => Promise<void>;
  updateFromAIContent: (aiGeneratedSections: ResumeSection[]) => void;
};

const defaultSections: ResumeSection[] = [
  {
    id: uuidv4(),
    type: "personal",
    header: "Personal Information",
    content: {
      fullName: "",
      email: "",
      phone: "",
      location: ""
    } as PersonalSection['content'],
  },
  {
    id: uuidv4(),
    type: "summary",
    header: "Professional Summary",
    content: {
      text: ""
    } as SummarySection['content'],
  },
  {
    id: uuidv4(),
    type: "experience",
    header: "Work Experience",
    content: [{
      company: "",
      position: "",
      startDate: new Date(),
      description: "",
      location: "",
      technologies: "",
      achievements: ""
    }] as ExperienceSection['content'],
  },
  {
    id: uuidv4(),
    type: "education",
    header: "Education",
    content: [{
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: new Date(),
      location: "",
      gpa: 0,
      description: "",
      achievements: ""
    }] as EducationSection['content'],
  },
  {
    id: uuidv4(),
    type: "skills",
    header: "Technical Skills",
    content: [{
      category: "Skills",
      skills: [{
        name: "",
        category: "",
        proficiencyLevel: 0,
        description: "",
        yearsOfExperience: 0
      }]
    }] as SkillsSection['content'],
  },
  {
    id: uuidv4(),
    type: "projects",
    header: "Projects",
    content: [{
      name: "",
      description: "",
      technologies: "",
      link: "",
      startDate: new Date()
    }] as ProjectsSection['content'],
  },
  {
    id: uuidv4(),
    type: "certifications",
    header: "Certifications",
    content: [{
      name: "",
      issuingOrganization: "",
      issueDate: new Date(),
      credentialId: "",
      credentialUrl: ""
    }] as CertificationsSection['content'],
  },
  {
    id: uuidv4(),
    type: "languages",
    header: "Languages",
    content: [{
      name: "",
      proficiencyLevel: "",
      certification: "",
      additionalInfo: "",
      speaking: 0,
      writing: 0,
      reading: 0,
      listening: 0
    }] as LanguagesSection['content'],
  },
  {
    id: uuidv4(),
    type: "awards",
    header: "Awards & Achievements",
    content: [{
      title: "",
      issuingOrganization: "",
      dateReceived: new Date(),
      description: "",
      category: "",
      level: "",
      url: ""
    }] as AwardsSection['content'],
  },
  {
    id: uuidv4(),
    type: "references",
    header: "References",
    content: [{
      name: "",
      position: "",
      company: "",
      relationship: "",
      description: ""
    }] as ReferencesSection['content'],
  },
  {
    id: uuidv4(),
    type: "publications",
    header: "Publications",
    content: [{
      title: "",
      authors: "",
      publisher: "",
      publicationDate: new Date(),
      description: "",
      doi: "",
      url: "",
      type: "",
      citation: "",
      impact: ""
    }] as PublicationsSection['content'],
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

  setSections: (sections: ResumeSection[]) => set({ sections }),

  updateFromAIContent: (aiGeneratedSections: ResumeSection[]) => {
    if (!Array.isArray(aiGeneratedSections)) {
      console.error(
        "aiGeneratedSections is not an array:",
        aiGeneratedSections
      );
      throw new Error("aiGeneratedSections must be an array");
    }
    console.log("ResumeStore - Starting updateFromAIContent with sections:", aiGeneratedSections);
    set((state) => {
      console.log("ResumeStore - Current state sections:", state.sections);
      const updatedSections = state.sections.map((section) => {
        const aiSection = aiGeneratedSections.find(
          (s) => s.type === section.type
        );
        if (!aiSection) return section;

        const newSection = {
          id: section.id,
          type: section.type,
          header: aiSection.header,
          content: aiSection.content,
          isLoading: section.isLoading,
        };

        switch (section.type) {
          case "personal":
            return newSection as PersonalSection;
          case "summary":
            return newSection as SummarySection;
          case "experience":
            return newSection as ExperienceSection;
          case "education":
            return newSection as EducationSection;
          case "skills":
            return newSection as SkillsSection;
          case "projects":
            return newSection as ProjectsSection;
          case "certifications":
            return newSection as CertificationsSection;
          case "languages":
            return newSection as LanguagesSection;
          case "awards":
            return newSection as AwardsSection;
          case "references":
            return newSection as ReferencesSection;
          case "publications":
            return newSection as PublicationsSection;
          default:
            return section;
        }
      });

      console.log("ResumeStore - Updated sections:", updatedSections);
      return { sections: updatedSections };
    });
  },

  setActiveSection: (sectionId) => set({ activeSection: sectionId }),

  reorderSections: (oldIndex: number, newIndex: number) =>
    set((state) => {
      const sections = state.sections.slice();
      const [removed] = sections.splice(oldIndex, 1);
      sections.splice(newIndex, 0, removed);
      return { sections: sections as ResumeSection[] };
    }),

  updateSectionHeader: (sectionId, header) =>
    set((state) => ({
      sections: state.sections.map((section) => {
        if (section.id !== sectionId) return section;

        const newSection = {
          id: section.id,
          type: section.type,
          header,
          content: section.content,
          isLoading: section.isLoading,
        };

        switch (section.type) {
          case "personal":
            return newSection as PersonalSection;
          case "summary":
            return newSection as SummarySection;
          case "experience":
            return newSection as ExperienceSection;
          case "education":
            return newSection as EducationSection;
          case "skills":
            return newSection as SkillsSection;
          case "projects":
            return newSection as ProjectsSection;
          case "certifications":
            return newSection as CertificationsSection;
          case "languages":
            return newSection as LanguagesSection;
          case "awards":
            return newSection as AwardsSection;
          case "references":
            return newSection as ReferencesSection;
          case "publications":
            return newSection as PublicationsSection;
          default:
            return section;
        }
      }),
    })),

  updateSection: <T extends ResumeSection>(
    sectionId: string,
    content: T["content"] | string
  ) =>
    set((state) => ({
      sections: state.sections.map((section) => {
        if (section.id !== sectionId) return section;

        // Parse the content if it's a string and contains valid JSON, otherwise use as-is
        let parsedContent;
        if (typeof content === 'string') {
          try {
            parsedContent = JSON.parse(content);
          } catch {
            // If parsing fails, use the raw string (for simple text fields)
            parsedContent = content;
          }
        } else {
          parsedContent = content;
        }

        const newSection = {
          id: section.id,
          type: section.type,
          header: section.header,
          content: parsedContent,
          isLoading: section.isLoading,
        };

        switch (section.type) {
          case "personal":
            return newSection as PersonalSection;
          case "summary":
            return newSection as SummarySection;
          case "experience":
            return newSection as ExperienceSection;
          case "education":
            return newSection as EducationSection;
          case "skills":
            return newSection as SkillsSection;
          case "projects":
            return newSection as ProjectsSection;
          case "certifications":
            return newSection as CertificationsSection;
          case "languages":
            return newSection as LanguagesSection;
          case "awards":
            return newSection as AwardsSection;
          case "references":
            return newSection as ReferencesSection;
          case "publications":
            return newSection as PublicationsSection;
          default:
            return section;
        }
      }),
    })),

  addSection: (type: SectionType) => {
    let newSection: ResumeSection;

    switch (type) {
      case "personal":
        newSection = {
          id: uuidv4(),
          type,
          header: "Personal Information",
          content: { fullName: "", email: "", phone: "", location: "" },
        } as PersonalSection;
        break;
      case "summary":
        newSection = {
          id: uuidv4(),
          type,
          header: "Professional Summary",
          content: { text: "" },
        } as SummarySection;
        break;
      case "skills":
        newSection = {
          id: uuidv4(),
          type,
          header: "Skills",
          content: [{ category: "Skills", skills: [] }],
        } as SkillsSection;
        break;
      default:
        newSection = {
          id: uuidv4(),
          type,
          header: "New Section",
          content: [],
        } as ResumeSection;
    }

    set((state) => ({
      sections: [...state.sections, newSection],
    }));
  },

  initializeEmptyResume: () => {
    set({
      resumeId: null,
      title: "",
      sections: defaultSections.map((section) => {
        const newSection = {
          id: uuidv4(),
          type: section.type,
          header: section.header,
          content: section.content,
        };

        switch (section.type) {
          case "personal":
            return newSection as PersonalSection;
          case "summary":
            return newSection as SummarySection;
          case "experience":
            return newSection as ExperienceSection;
          case "education":
            return newSection as EducationSection;
          case "skills":
            return newSection as SkillsSection;
          case "projects":
            return newSection as ProjectsSection;
          case "certifications":
            return newSection as CertificationsSection;
          case "languages":
            return newSection as LanguagesSection;
          case "awards":
            return newSection as AwardsSection;
          case "references":
            return newSection as ReferencesSection;
          case "publications":
            return newSection as PublicationsSection;
          default:
            return newSection as ResumeSection;
        }
      }),
      activeSection: null,
    });
  },

  loadResume: async (id: string) => {
    set({ isLoading: true });

    try {
      const initialSections = defaultSections.map((section) => {
        const newSection = {
          id: uuidv4(),
          type: section.type,
          header: section.header,
          content: section.content,
          isLoading: true,
        };

        switch (section.type) {
          case "personal":
            return newSection as PersonalSection;
          case "summary":
            return newSection as SummarySection;
          case "experience":
            return newSection as ExperienceSection;
          case "education":
            return newSection as EducationSection;
          case "skills":
            return newSection as SkillsSection;
          case "projects":
            return newSection as ProjectsSection;
          case "certifications":
            return newSection as CertificationsSection;
          case "languages":
            return newSection as LanguagesSection;
          case "awards":
            return newSection as AwardsSection;
          case "references":
            return newSection as ReferencesSection;
          case "publications":
            return newSection as PublicationsSection;
          default:
            return newSection as ResumeSection;
        }
      });

      set({ resumeId: id, sections: initialSections });

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

        if (!loadedSection) {
          const newSection = {
            id: uuidv4(),
            type: defaultSection.type,
            header: defaultSection.header,
            content: defaultSection.content,
          };
          switch (defaultSection.type) {
            case "personal":
              return newSection as PersonalSection;
            case "summary":
              return newSection as SummarySection;
            case "experience":
              return newSection as ExperienceSection;
            case "education":
              return newSection as EducationSection;
            case "skills":
              return newSection as SkillsSection;
            case "projects":
              return newSection as ProjectsSection;
            case "certifications":
              return newSection as CertificationsSection;
            case "languages":
              return newSection as LanguagesSection;
            case "awards":
              return newSection as AwardsSection;
            case "references":
              return newSection as ReferencesSection;
            case "publications":
              return newSection as PublicationsSection;
            default:
              return newSection as ResumeSection;
          }
        }

        const newSection = {
          id: uuidv4(),
          type: defaultSection.type,
          header: loadedSection.header || defaultSection.header,
          content: loadedSection.content,
        };

        switch (defaultSection.type) {
          case "personal":
            return newSection as PersonalSection;
          case "summary":
            return newSection as SummarySection;
          case "experience":
            return newSection as ExperienceSection;
          case "education":
            return newSection as EducationSection;
          case "skills":
            return newSection as SkillsSection;
          case "projects":
            return newSection as ProjectsSection;
          case "certifications":
            return newSection as CertificationsSection;
          case "languages":
            return newSection as LanguagesSection;
          case "awards":
            return newSection as AwardsSection;
          case "references":
            return newSection as ReferencesSection;
          case "publications":
            return newSection as PublicationsSection;
          default:
            return newSection as ResumeSection;
        }
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
            const newSection = {
              id: uuidv4(),
              type: defaultSection.type,
              header: defaultSection.header,
              content: defaultSection.content,
            };
            switch (type) {
              case "personal":
                sectionsWithIds.unshift(newSection as PersonalSection);
                break;
              case "summary":
                sectionsWithIds.unshift(newSection as SummarySection);
                break;
              case "experience":
                sectionsWithIds.unshift(newSection as ExperienceSection);
                break;
              case "education":
                sectionsWithIds.unshift(newSection as EducationSection);
                break;
            }
          }
        }
      }

      type SectionContent = {
        [K in SectionType]: Extract<ResumeSection, { type: K }>["content"];
      };

      interface LoadedSection {
        type: SectionType;
        header: string;
        content: SectionContent[SectionType];
      }

      // Load each section individually with a delay
      const loadSectionContent = async (sections: LoadedSection[]) => {
        const delay = 200; // 200ms delay between each section

        for (const loadedSection of sections) {
          await new Promise((resolve) => setTimeout(resolve, delay));

          set((state) => {
            const updatedSections = state.sections.map((section) => {
              if (section.type !== loadedSection.type) return section;

              const newSection = {
                id: section.id,
                type: section.type,
                header: loadedSection.header || section.header,
                content: loadedSection.content,
                isLoading: false,
              };

              switch (section.type) {
                case "personal":
                  return newSection as PersonalSection;
                case "summary":
                  return newSection as SummarySection;
                case "experience":
                  return newSection as ExperienceSection;
                case "education":
                  return newSection as EducationSection;
                case "skills":
                  return newSection as SkillsSection;
                case "projects":
                  return newSection as ProjectsSection;
                case "certifications":
                  return newSection as CertificationsSection;
                case "languages":
                  return newSection as LanguagesSection;
                case "awards":
                  return newSection as AwardsSection;
                case "references":
                  return newSection as ReferencesSection;
                case "publications":
                  return newSection as PublicationsSection;
                default:
                  return section;
              }
            });

            return { sections: updatedSections };
          });
        }
      };

      set({ title: resume.title || "" });
      await loadSectionContent(contentSections);

      // Only set overall loading to false after all sections are done
      set((state) => ({
        isLoading: false,
        sections: state.sections.map((section) => {
          const newSection = {
            id: section.id,
            type: section.type,
            header: section.header,
            content: section.content,
            isLoading: false,
          };

          switch (section.type) {
            case "personal":
              return newSection as PersonalSection;
            case "summary":
              return newSection as SummarySection;
            case "experience":
              return newSection as ExperienceSection;
            case "education":
              return newSection as EducationSection;
            case "skills":
              return newSection as SkillsSection;
            case "projects":
              return newSection as ProjectsSection;
            case "certifications":
              return newSection as CertificationsSection;
            case "languages":
              return newSection as LanguagesSection;
            case "awards":
              return newSection as AwardsSection;
            case "references":
              return newSection as ReferencesSection;
            case "publications":
              return newSection as PublicationsSection;
            default:
              return section;
          }
        }),
      }));
    } catch (error) {
      console.error("Error loading resume:", error);
      set({ isLoading: false });
      throw error;
    }
  },
}));
