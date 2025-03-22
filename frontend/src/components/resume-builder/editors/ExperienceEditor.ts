"use client";
import { createEditor } from "./EditorFactory";

export type Experience = {
  companyName: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  isCurrentJob: boolean;
  description: string;
};

export const ExperienceEditor = createEditor<Experience>({
  name: "experience",
  emptyState: {
    companyName: "",
    jobTitle: "",
    startDate: "",
    endDate: "",
    isCurrentJob: false,
    description: "",
  },
  fields: {
    companyName: {
      type: "text",
      label: "Company Name",
      placeholder: "Company Name",
      colSpan: 1
    },
    jobTitle: {
      type: "text",
      label: "Job Title",
      placeholder: "Job Title",
      colSpan: 1
    },
    startDate: {
      type: "date",
      label: "Start Date",
      colSpan: 1
    },
    endDate: {
      type: "date",
      label: "End Date",
      colSpan: 1,
      dependentDisable: {
        field: "isCurrentJob",
        value: true
      }
    },
    isCurrentJob: {
      type: "checkbox",
      label: "I currently work here",
      colSpan: 2
    },
    description: {
      type: "richtext",
      label: "Description",
      colSpan: 2
    }
  },
  addButtonText: "Add Job",
  emptyMessage: "No experience added yet. Click the button below to add your first job."
});