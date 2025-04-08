import { create } from "zustand";
import { Section, SectionType } from "@/types/resume/sections";
import { resumeService } from "@/services/resume-service";

export interface AIFeedback {
  improvements: string;
  missingKeywords: string[];
  insights: string;
}

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
  generateResume: (prompt: string) => Promise<void>;
  calculateScore: (contentSections: Section[]) => Promise<void>;
  generateFeedback: (resumeId: `${string}-${string}-${string}-${string}-${string}`) => Promise<void>;
  generateFromJobs: (contentSections: Section[], useCurrentResumeInfo: boolean) => Promise<void>;
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
      console.log(response)
      if (response) {
        set({
          previewSections: response.map((section: { type: SectionType; header: string; content: string }) => ({
            ...section,
            id: crypto.randomUUID(),
          })),
        });
      }
    } catch (error) {
      console.error("Error generating resume:", error);
      throw error;
    } finally {
      set({ isGenerating: false });
    }
  },

  calculateScore: async (contentSections: Section[]) => {
    set({ isScoringResume: true });
    try {
      const filteredSections = contentSections
        .filter(section => section.type !== "personal")
        .map(({ type, header, content }) => ({ type, header, content }));
      const response = await resumeService.CalculateResumeScore(filteredSections);
      set({ score: response.score });
      return response.score;
    } catch (error) {
      console.error("Error calculating score:", error);
      throw error;
    } finally {
      set({ isScoringResume: false });
    }
  },

  generateFeedback: async (resumeId: `${string}-${string}-${string}-${string}-${string}`) => {
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

  generateFromJobs: async (contentSections: Section[], useCurrentResumeInfo: boolean) => {
    const { jobDescriptions } = get();
    const nonEmptyDescriptions = jobDescriptions.filter(desc => desc.trim());
    
    if (!nonEmptyDescriptions.length) return;
    
    set({ isGenerating: true });
    try {
      const filteredSections = contentSections
        .filter(section => section.type !== "personal")
        .map(({ type, header, content }) => ({ type, header, content }));
      const response = await resumeService.GenerateResumeFromJobDescription(
        filteredSections,
        nonEmptyDescriptions,
        useCurrentResumeInfo
      );
      if (response?.content) {
        set({
          previewSections: response.content.map((section: { type: SectionType; header: string; content: string }) => ({
            ...section,
            id: crypto.randomUUID(),
          })),
        });
      }
      return response;
    } catch (error) {
      console.error("Error generating resume from jobs:", error);
      throw error;
    } finally {
      set({ isGenerating: false });
    }
  },

  addJobDescription: () => 
    set((state) => ({ jobDescriptions: [...state.jobDescriptions, ""] })),

  updateJobDescription: (index, value) =>
    set((state) => ({
      jobDescriptions: state.jobDescriptions.map((desc, i) =>
        i === index ? value : desc
      ),
    })),

  removeJobDescription: (index) =>
    set((state) => ({
      jobDescriptions: state.jobDescriptions.filter((_, i) => i !== index),
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
    isGeneratingFeedback: false,
  }),
}));
