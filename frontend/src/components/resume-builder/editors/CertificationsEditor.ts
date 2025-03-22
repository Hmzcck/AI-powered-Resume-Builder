"use client";
import { createEditor } from "./EditorFactory";

export type Certification = {
  name: string;
  issuer: string;
  link: string;
  date: string;
  description: string;
};

export const CertificationsEditor = createEditor<Certification>({
  name: "certification",
  emptyState: {
    name: "",
    issuer: "",
    link: "",
    date: "",
    description: "",
  },
  fields: {
    name: {
      type: "text",
      label: "Certificate Name",
      placeholder: "e.g., AWS Certified Solutions Architect",
      colSpan: 1
    },
    issuer: {
      type: "text",
      label: "Issuer",
      placeholder: "e.g., Amazon Web Services",
      colSpan: 1
    },
    link: {
      type: "url",
      label: "Certificate Link",
      placeholder: "https://...",
      colSpan: 1
    },
    date: {
      type: "date",
      label: "Date Earned",
      colSpan: 1
    },
    description: {
      type: "richtext",
      label: "Description",
      colSpan: 2
    }
  },
  addButtonText: "Add Certification",
  emptyMessage: "No certifications added yet. Click the button below to add your certifications."
});