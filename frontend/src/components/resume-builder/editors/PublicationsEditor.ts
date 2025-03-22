"use client";
import { createEditor } from "./EditorFactory";

export type Publication = {
  title: string;
  authors: string;
  venue: string;
  publicationDate: string;
  doi: string;
  description: string;
};

export const PublicationsEditor = createEditor<Publication>({
  name: "publication",
  emptyState: {
    title: "",
    authors: "",
    venue: "",
    publicationDate: "",
    doi: "",
    description: "",
  },
  fields: {
    title: {
      type: "text",
      label: "Title",
      placeholder: "Publication Title",
      colSpan: 2
    },
    authors: {
      type: "text",
      label: "Authors",
      placeholder: "e.g., John Doe, Jane Smith",
      colSpan: 1
    },
    venue: {
      type: "text",
      label: "Journal/Conference",
      placeholder: "e.g., Journal of Computer Science",
      colSpan: 1
    },
    publicationDate: {
      type: "date",
      label: "Publication Date",
      colSpan: 1
    },
    doi: {
      type: "text",
      label: "DOI/URL",
      placeholder: "e.g., 10.1000/xyz123",
      colSpan: 1
    },
    description: {
      type: "richtext",
      label: "Description",
      colSpan: 2
    }
  },
  addButtonText: "Add Publication",
  emptyMessage: "No publications added yet. Click the button below to add your publications."
});