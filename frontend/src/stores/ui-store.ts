import { create } from "zustand";
import { AITab } from "@/types/ui";

type UIStore = {
  minimizedSections: Set<string>;
  aiTab: AITab;
  toggleSectionMinimized: (sectionId: string) => void;
  setAITab: (tab: AITab) => void;
};

export const useUIStore = create<UIStore>((set) => ({
  minimizedSections: new Set<string>(),
  aiTab: "build",
  toggleSectionMinimized: (sectionId: string) =>
    set((state) => {
      const newMinimizedSections = new Set(state.minimizedSections);
      if (newMinimizedSections.has(sectionId)) {
        newMinimizedSections.delete(sectionId);
      } else {
        newMinimizedSections.add(sectionId);
      }
      return { minimizedSections: newMinimizedSections };
    }),
  setAITab: (tab) => set({ aiTab: tab }),
}));
