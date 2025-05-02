"use client";
import { createEditor } from "./EditorFactory";
import React from "react";

// Internal format used by the editor UI
export type Experience = {
  companyName: string;
  jobTitle: string;
  startDate: string; // ISO string (e.g., "2024-05-01")
  endDate: string;
  isCurrentJob: boolean;
  description: string;
};

// External format expected from and emitted to the app
export type ExperienceItem = {
  company: string | null;
  position: string | null;
  startDate: Date | null;
  endDate?: Date | null;
  description: string | null;
  location: string | null;
  achievements: string | null;
  technologies: string | null;
};

// Props for the editor component
export type ExperienceEditorProps = {
  value?: ExperienceItem[];
  onChange?: (data: ExperienceItem[]) => void;
  [key: string]: unknown;
};

// Editor UI schema configuration
const BaseExperienceEditor = createEditor<Experience>({
  name: "experience",
  emptyState: {
    companyName: "test",
    jobTitle: "test",
    startDate: "",
    endDate: "",
    isCurrentJob: false,
    description: "test",
  },
  fields: {
    companyName: {
      type: "text",
      label: "Company Name",
      placeholder: "Company Name",
      colSpan: 1,
    },
    jobTitle: {
      type: "text",
      label: "Job Title",
      placeholder: "Job Title",
      colSpan: 1,
    },
    startDate: {
      type: "date",
      label: "Start Date",
      colSpan: 1,
    },
    endDate: {
      type: "date",
      label: "End Date",
      colSpan: 1,
      dependentDisable: {
        field: "isCurrentJob",
        value: true,
      },
    },
    isCurrentJob: {
      type: "checkbox",
      label: "I currently work here",
      colSpan: 2,
    },
    description: {
      type: "richtext",
      label: "Description",
      colSpan: 2,
    },
  },
  addButtonText: "Add Job",
  emptyMessage: "No experience added yet. Click the button below to add your first job.",
});

// Main component
export const ExperienceEditor = React.forwardRef<unknown, ExperienceEditorProps>(
  (props, _ref) => {
    console.log("ExperienceEditor - Incoming Props:", props);

    // Transform external value to internal Experience format
    const transformedData: Experience[] = React.useMemo(() => {
      const items = Array.isArray(props.value) ? props.value : [];
    
      // Eğer hiçbir item yoksa, 1 adet default item ile başla
      if (items.length === 0) {
        return [
          {
            companyName: "test",
            jobTitle: "test",
            startDate: "",
            endDate: "",
            isCurrentJob: false,
            description: "<p>Enter description</p>", // burada HTML format öneriyoruz
          },
        ];
      }
      console.log("ExperienceEditor - Transforming data items:", items);
      return items.map((item): Experience => ({
        companyName: item.company && item.company.trim() !== ""? item.company : "Enter company name",
        jobTitle: item.position ?? item.position.trim() !== "" ? item.position : "Enter job title",
        startDate: item.startDate ? item.startDate.toISOString().split("T")[0] : "",
        endDate: item.endDate ? item.endDate.toISOString().split("T")[0] : "",
        isCurrentJob: !item.endDate,
        description:
          item.description && item.description.trim() !== ""
            ? item.description
            : "<p>Enter description</p>",
      }));
    }, [props.value]);

    // Handle changes from editor and transform back to ExperienceItem[]
    const handleChange = (data: Experience | Experience[]) => {
      const items = Array.isArray(data) ? data : [data];

      const transformed: ExperienceItem[] = items.map((item): ExperienceItem => {
        const safeParseDate = (value: string): Date | null => {
          const date = new Date(value);
          return isNaN(date.getTime()) ? null : date;
        };

        return {
          company: item.companyName,
          position: item.jobTitle,
          startDate: item.startDate ? safeParseDate(item.startDate) : null,
          endDate: item.isCurrentJob
            ? null
            : item.endDate
            ? safeParseDate(item.endDate)
            : null,
          description: item.description,
          location: null,
          achievements: null,
          technologies: null,
        };
      });

      console.log("ExperienceEditor - Emitting transformed data:", transformed);
      props.onChange?.(transformed);
    };

    // Destructure and forward remaining props
    const { value, onChange, ...restProps } = props;

    return (
      <BaseExperienceEditor
        {...restProps}
        value={transformedData}
        onChange={handleChange}
      />
    );
  }
);

ExperienceEditor.displayName = "ExperienceEditor";
