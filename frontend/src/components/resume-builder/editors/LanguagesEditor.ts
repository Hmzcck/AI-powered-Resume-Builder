"use client";
import { createEditor } from "./EditorFactory";

export type Language = {
  name: string;
  proficiency: string;
};

const proficiencyLevels = [
  "Native",
  "Fluent",
  "Professional",
  "Intermediate",
  "Basic",
];

export const LanguagesEditor = createEditor<Language>({
  name: "language",
  emptyState: {
    name: "",
    proficiency: "",
  },
  fields: {
    name: {
      type: "text",
      label: "Language Name",
      placeholder: "e.g., English, Spanish",
      colSpan: 1
    },
    proficiency: {
      type: "select",
      label: "Proficiency Level",
      placeholder: "Select proficiency level",
      options: proficiencyLevels,
      colSpan: 1
    }
  },
  addButtonText: "Add Language",
  emptyMessage: "No languages added yet. Click the button below to add a language."
});