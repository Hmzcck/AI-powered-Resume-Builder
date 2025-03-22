"use client";
import { createEditor } from "./EditorFactory";

export type Project = {
  projectName: string;
  technologies: string;
  startDate: string;
  endDate: string;
  isOngoing: boolean;
  description: string;
};

export const ProjectsEditor = createEditor<Project>({
  name: "project",
  emptyState: {
    projectName: "",
    technologies: "",
    startDate: "",
    endDate: "",
    isOngoing: false,
    description: "",
  },
  fields: {
    projectName: {
      type: "text",
      label: "Project Name",
      placeholder: "Project Name",
      colSpan: 1
    },
    technologies: {
      type: "text",
      label: "Technologies Used",
      placeholder: "e.g., React, Node.js, TypeScript",
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
        field: "isOngoing",
        value: true
      }
    },
    isOngoing: {
      type: "checkbox",
      label: "This is an ongoing project",
      colSpan: 2
    },
    description: {
      type: "richtext",
      label: "Description",
      colSpan: 2
    }
  },
  addButtonText: "Add Project",
  emptyMessage: "No projects added yet. Click the button below to add your projects."
});