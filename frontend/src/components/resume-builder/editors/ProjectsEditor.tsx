"use client";
import { createEditor } from "./EditorFactory";
import React from "react";

// Internal format used by the editor UI
export type Project = {
  projectName: string;
  technologies: string;
  startDate: string;
  endDate: string;
  isOngoing: boolean;
  description: string;
};

// External format expected from and emitted to the app
export type ProjectItem = {
  name: string | null;
  description: string | null;
  technologies: string | null;
  link: string | null;
  startDate: Date | null;
  endDate?: Date | null;
};

// Props for the editor component
export type ProjectsEditorProps = {
  value?: ProjectItem[];
  onChange?: (data: ProjectItem[]) => void;
  [key: string]: unknown;
};

// Base editor configuration
const BaseProjectsEditor = createEditor<Project>({
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

// Main component
export const ProjectsEditor = React.forwardRef<unknown, ProjectsEditorProps>(
  (props, _ref) => {
    // Transform external value to internal Project format
    const transformedData: Project[] = React.useMemo(() => {
      const items = Array.isArray(props.value) ? props.value : [];
    
      if (items.length === 0) {
        return [
          {
            projectName: "",
            technologies: "",
            startDate: "",
            endDate: "",
            isOngoing: false,
            description: "",
          },
        ];
      }
      
      return items.map((item): Project => ({
        projectName: item.name || "",
        technologies: item.technologies || "",
        startDate: item.startDate ? item.startDate.toISOString().split("T")[0] : "",
        endDate: item.endDate ? item.endDate.toISOString().split("T")[0] : "",
        isOngoing: !item.endDate,
        description: item.description || "",
      }));
    }, [props.value]);

    // Handle changes from editor and transform back to ProjectItem[]
    const handleChange = (data: Project | Project[]) => {
      const items = Array.isArray(data) ? data : [data];

      const transformed: ProjectItem[] = items.map((item): ProjectItem => {
        const safeParseDate = (value: string): Date | null => {
          const date = new Date(value);
          return isNaN(date.getTime()) ? null : date;
        };

        return {
          name: item.projectName,
          description: item.description,
          technologies: item.technologies,
          link: null,
          startDate: item.startDate ? safeParseDate(item.startDate) : null,
          endDate: item.isOngoing
            ? null
            : item.endDate
            ? safeParseDate(item.endDate)
            : null,
        };
      });

      props.onChange?.(transformed);
    };

    // Destructure and forward remaining props
    const { value, onChange, ...restProps } = props;

    return (
      <BaseProjectsEditor
        {...restProps}
        value={transformedData}
        onChange={handleChange}
      />
    );
  }
);

ProjectsEditor.displayName = "ProjectsEditor";