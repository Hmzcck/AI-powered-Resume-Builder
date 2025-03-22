import { create } from "zustand";

type UIStore = {
  minimizedSections: Set<string>;
  toggleSectionMinimized: (sectionId: string) => void;
};

export const useUIStore = create<UIStore>((set) => ({
  minimizedSections: new Set<string>(),
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
}));
