import { create } from "zustand";
import { Section } from "@/types/resume/sections";
import { resumeService } from "@/services/resume-service";

import { 
  AiFeedbackDto, 
  ResumeDto,
  LanguageDto,
  ExperienceDto,
  EducationDto,
  SkillDto,
  ProjectDto,
  CertificationDto,
  AwardDto
} from "@/types/resume/models";

export type AIFeedback = AiFeedbackDto;

interface AIStore {
  // State
  prompt: string;
  score: number | null;
  feedback: AIFeedback | null;
  jobDescriptions: string[];
  previewSections: Section[] | null;
  isGenerating: boolean;
  isScoringResume: boolean;
  isGeneratingFeedback: boolean;

  // Actions
  setPrompt: (prompt: string) => void;
  generateResume: (prompt: string) => Promise<ResumeDto | void>;
  calculateScore: (contentSections: Section[]) => Promise<number | void>;
  generateFeedback: (resumeId: `${string}-${string}-${string}-${string}-${string}`) => Promise<AiFeedbackDto>;
  generateFromJobs: (contentSections: Section[], useCurrentResumeInfo: boolean) => Promise<ResumeDto | undefined>;
  addJobDescription: () => void;
  updateJobDescription: (index: number, value: string) => void;
  removeJobDescription: (index: number) => void;
  clearJobDescriptions: () => void;
  setPreviewSections: (sections: Section[]) => void;
  clearPreview: () => void;
  resetState: () => void;
}

export const useAIStore = create<AIStore>((set, get) => ({
  // Initial state
  prompt: "",
  score: null,
  feedback: null,
  jobDescriptions: [""],
  previewSections: null,
  isGenerating: false,
  isScoringResume: false,
  isGeneratingFeedback: false,

  // Actions
  setPrompt: (prompt) => set({ prompt }),

  generateResume: async (prompt) => {
    set({ isGenerating: true });
    try {
      const response = await resumeService.GenerateResume(prompt);
      console.log("AI Response:", response);
      
      if (response) {
        const sections: Section[] = [];
        
        // Add summary if exists
        if (response.summary?.content) {
          sections.push({
            id: crypto.randomUUID(),
            type: "summary" as const,
            header: "Summary",
            content: response.summary.content
          });
        }
        
        // Add experiences if exist
        if (response.experiences && Array.isArray(response.experiences)) {
          const experienceSection = {
            id: crypto.randomUUID(),
            type: "experience" as const,
            header: "Experience",
            content: response.experiences.map(exp => ({
              company: exp.company || '',
              position: exp.position || '',
              startDate: exp.startDate ? new Date(exp.startDate) : new Date(),
              endDate: exp.endDate ? new Date(exp.endDate) : undefined,
              description: exp.description || '',
              location: exp.location,
              technologies: exp.technologies,
              achievements: exp.achievements
            }) as ExperienceDto)
          };
          sections.push(experienceSection);
        }
        
        // Add education if exists
        if (response.education && Array.isArray(response.education)) {
          sections.push({
            id: crypto.randomUUID(),
            type: "education" as const,
            header: "Education",
            content: response.education.map(edu => ({
              institution: edu.institution || '',
              degree: edu.degree || '',
              fieldOfStudy: edu.fieldOfStudy || '',
              startDate: edu.startDate ? new Date(edu.startDate) : new Date(),
              endDate: edu.endDate ? new Date(edu.endDate) : undefined,
              location: edu.location,
              gpa: edu.gpa,
              description: edu.description,
              achievements: edu.achievements
            }) as EducationDto)
          });
        }
        
        // Add skills if exist
        if (response.skills && Array.isArray(response.skills)) {
          sections.push({
            id: crypto.randomUUID(),
            type: "skills" as const,
            header: "Skills",
            content: response.skills.map(skill => ({
              name: skill.name || '',
              category: skill.category || 'General',
              yearsOfExperience: skill.yearsOfExperience || 0,
              proficiencyLevel: skill.proficiencyLevel,
              description: skill.description
            }) as SkillDto)
          });
        }
        
        // Add projects if exist
        if (response.projects && Array.isArray(response.projects)) {
          sections.push({
            id: crypto.randomUUID(),
            type: "projects" as const,
            header: "Projects",
            content: response.projects.map(project => ({
              name: project.name || '',
              description: project.description || '',
              technologies: project.technologies,
              link: project.link,
              startDate: project.startDate ? new Date(project.startDate) : undefined,
              endDate: project.endDate ? new Date(project.endDate) : undefined
            }) as ProjectDto)
          });
        }
        
        // Add certifications if exist
        if (response.certifications && Array.isArray(response.certifications)) {
          sections.push({
            id: crypto.randomUUID(),
            type: "certifications" as const,
            header: "Certifications",
            content: response.certifications.map(cert => ({
              name: cert.name || '',
              issuingOrganization: cert.issuingOrganization || '',
              issueDate: cert.issueDate ? new Date(cert.issueDate) : undefined,
              expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : undefined,
              credentialId: cert.credentialId,
              credentialUrl: cert.credentialUrl
            }) as CertificationDto)
          });
        }
        
        // Add languages if exist
        if (response.languages && Array.isArray(response.languages)) {
          sections.push({
            id: crypto.randomUUID(),
            type: "languages" as const,
            header: "Languages",
            content: response.languages.map(lang => ({
              name: lang.name || '',
              proficiencyLevel: lang.proficiencyLevel || '',
              certification: lang.certification,
              additionalInfo: lang.additionalInfo,
              speaking: lang.speaking,
              writing: lang.writing,
              reading: lang.reading,
              listening: lang.listening
            }) as LanguageDto)
          });
        }

        // Add awards if exist
        if (response.awards && Array.isArray(response.awards)) {
          sections.push({
            id: crypto.randomUUID(),
            type: "awards" as const,
            header: "Awards",
            content: response.awards.map(award => ({
              title: award.title || '',
              issuingOrganization: award.issuingOrganization || '',
              dateReceived: award.dateReceived ? new Date(award.dateReceived) : new Date(),
              description: award.description,
              category: award.category,
              level: award.level,
              url: award.url
            }) as AwardDto)
          });
        }
        
        set({ previewSections: sections });
      }
    } catch (error) {
      console.error("Error generating resume:", error);
      throw error;
    } finally {
      set({ isGenerating: false });
    }
  },

  calculateScore: async (_contentSections) => {
    set({ isScoringResume: true });
    try {
      const response = await resumeService.CalculateResumeScore({
        title: "",
        experiences: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        languages: [],
        awards: [],
        publications: [],
        references: []
      });
      set({ score: response });
      return response;
    } catch (error) {
      console.error("Error calculating score:", error);
      throw error;
    } finally {
      set({ isScoringResume: false });
    }
  },

  generateFeedback: async (resumeId) => {
    set({ isGeneratingFeedback: true });
    try {
      const response = await resumeService.GenerateFeedback(resumeId);
      set({ feedback: response });
      return response;
    } catch (error) {
      console.error("Error generating feedback:", error);
      throw error;
    } finally {
      set({ isGeneratingFeedback: false });
    }
  },

  generateFromJobs: async (_contentSections, useCurrentResumeInfo) => {
    const { jobDescriptions } = get();
    const nonEmptyDescriptions = jobDescriptions.filter(desc => desc.trim());
    
    if (!nonEmptyDescriptions.length) return;
    
    set({ isGenerating: true });
    try {
      const response = await resumeService.GenerateResumeFromJobDescription(
        {
          title: "",
          experiences: [],
          education: [],
          skills: [],
          projects: [],
          certifications: [],
          languages: [],
          awards: [],
          publications: [],
          references: []
        },
        nonEmptyDescriptions,
        useCurrentResumeInfo
      );

      if (response) {
        const sections: Section[] = [];
        
        // Add experiences if exist
        if (response.experiences && Array.isArray(response.experiences)) {
          const experienceSection = {
            id: crypto.randomUUID(),
            type: "experience" as const,
            header: "Experience",
            content: response.experiences.map(exp => ({
              company: exp.company || '',
              position: exp.position || '',
              startDate: exp.startDate ? new Date(exp.startDate) : new Date(),
              endDate: exp.endDate ? new Date(exp.endDate) : undefined,
              description: exp.description || '',
              location: exp.location,
              technologies: exp.technologies,
              achievements: exp.achievements
            }) as ExperienceDto)
          };
          sections.push(experienceSection);
        }
        
        set({ previewSections: sections });
      }
      return response;
    } catch (error) {
      console.error("Error generating resume from jobs:", error);
      throw error;
    } finally {
      set({ isGenerating: false });
    }
  },

  addJobDescription: () => set((state) => ({ 
    jobDescriptions: [...state.jobDescriptions, ""] 
  })),

  updateJobDescription: (index, value) => set((state) => ({
    jobDescriptions: state.jobDescriptions.map((desc, i) => 
      i === index ? value : desc
    )
  })),

  removeJobDescription: (index) => set((state) => ({
    jobDescriptions: state.jobDescriptions.filter((_, i) => i !== index)
  })),

  clearJobDescriptions: () => set({ jobDescriptions: [""] }),

  setPreviewSections: (sections) => set({ previewSections: sections }),

  clearPreview: () => set({ previewSections: null }),

  resetState: () => set({
    prompt: "",
    score: null,
    feedback: null,
    jobDescriptions: [""],
    previewSections: null,
    isGenerating: false,
    isScoringResume: false,
    isGeneratingFeedback: false
  })
}));
