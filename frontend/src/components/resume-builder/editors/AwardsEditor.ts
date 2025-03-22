"use client";
import { createEditor } from "./EditorFactory";

export type Award = {
  name: string;
  date: string;
  link: string;
  description: string;
};

export const AwardsEditor = createEditor<Award>({
  name: "award",
  emptyState: {
    name: "",
    date: "",
    link: "",
    description: "",
  },
  fields: {
    name: {
      type: "text",
      label: "Name",
      placeholder: "e.g., Best Innovation Award",
      colSpan: 2
    },
    date: {
      type: "date",
      label: "Date",
      colSpan: 1
    },
    link: {
      type: "url",
      label: "Link",
      placeholder: "https://example.com/award",
      colSpan: 1
    },
    description: {
      type: "richtext",
      label: "Description",
      colSpan: 2
    }
  },
  addButtonText: "Add Award",
  emptyMessage: "No awards added yet. Click the button below to add your awards and achievements."
});