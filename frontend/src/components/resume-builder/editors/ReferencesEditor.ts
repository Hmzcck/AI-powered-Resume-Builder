"use client";
import { createEditor } from "./EditorFactory";

export type Reference = {
  fullName: string;
  jobTitle: string;
  company: string;
  email: string;
  phone: string;
  relationship: string;
  additionalInfo: string;
};

export const ReferencesEditor = createEditor<Reference>({
  name: "reference",
  emptyState: {
    fullName: "",
    jobTitle: "",
    company: "",
    email: "",
    phone: "",
    relationship: "",
    additionalInfo: "",
  },
  fields: {
    fullName: {
      type: "text",
      label: "Full Name",
      placeholder: "e.g., John Doe",
      colSpan: 1
    },
    jobTitle: {
      type: "text",
      label: "Job Title",
      placeholder: "e.g., Senior Manager",
      colSpan: 1
    },
    company: {
      type: "text",
      label: "Company/Organization",
      placeholder: "e.g., Tech Solutions Inc.",
      colSpan: 1
    },
    email: {
      type: "email",
      label: "Email",
      placeholder: "e.g., john.doe@company.com",
      colSpan: 1
    },
    phone: {
      type: "tel",
      label: "Phone",
      placeholder: "e.g., +1 (555) 123-4567",
      colSpan: 1
    },
    relationship: {
      type: "text",
      label: "Relationship",
      placeholder: "e.g., Former Manager, Academic Advisor",
      colSpan: 1
    },
    additionalInfo: {
      type: "richtext",
      label: "Additional Information",
      colSpan: 2
    }
  },
  addButtonText: "Add Reference",
  emptyMessage: "No references added yet. Click the button below to add a reference."
});