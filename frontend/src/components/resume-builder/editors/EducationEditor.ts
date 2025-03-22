"use client";
import { createEditor } from "./EditorFactory";

export type Education = {
  schoolName: string;
  degree: string;
  major: string;
  gpa: string;
  startDate: string;
  endDate: string;
  isCurrentStudent: boolean;
  description: string;
};

export const EducationEditor = createEditor<Education>({
  name: "education",
  emptyState: {
    schoolName: "",
    degree: "",
    major: "",
    gpa: "",
    startDate: "",
    endDate: "",
    isCurrentStudent: false,
    description: "",
  },
  fields: {
    schoolName: {
      type: "text",
      label: "School Name",
      placeholder: "School Name",
      colSpan: 1
    },
    gpa: {
      type: "text",
      label: "GPA",
      placeholder: "e.g., 3.8/4.0",
      colSpan: 1
    },
    degree: {
      type: "text",
      label: "Degree",
      placeholder: "e.g., Bachelor's, Master's",
      colSpan: 1
    },
    major: {
      type: "text",
      label: "Major",
      placeholder: "e.g., Computer Science",
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
        field: "isCurrentStudent",
        value: true
      }
    },
    isCurrentStudent: {
      type: "checkbox",
      label: "I am currently studying here",
      colSpan: 2
    },
    description: {
      type: "richtext",
      label: "Description",
      colSpan: 2
    }
  },
  addButtonText: "Add Education",
  emptyMessage: "No education added yet. Click the button below to add your education."
});