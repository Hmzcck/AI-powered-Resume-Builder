"use client";
import { createEditor } from "./EditorFactory";
import React from "react";

// Internal format used by the editor UI
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

// External format expected from and emitted to the app
export type EducationItem = {
  institution: string | null;
  degree: string | null;
  fieldOfStudy: string | null;
  startDate: Date | null;
  endDate?: Date | null;
  location: string | null;
  gpa: number | null;
  description: string | null;
  achievements: string | null;
};

// Props for the editor component
export type EducationEditorProps = {
  value?: EducationItem[];
  onChange?: (data: EducationItem[]) => void;
  [key: string]: unknown;
};

// Base editor configuration
const BaseEducationEditor = createEditor<Education>({
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

// Main component
export const EducationEditor = React.forwardRef<unknown, EducationEditorProps>(
  (props, _ref) => {
    // Transform external value to internal Education format
    const transformedData: Education[] = React.useMemo(() => {
      const items = Array.isArray(props.value) ? props.value : [];
    
      if (items.length === 0) {
        return [
          {
            schoolName: "",
            degree: "",
            major: "",
            gpa: "",
            startDate: "",
            endDate: "",
            isCurrentStudent: false,
            description: "",
          },
        ];
      }
      
      return items.map((item): Education => ({
        schoolName: item.institution || "",
        degree: item.degree || "",
        major: item.fieldOfStudy || "",
        gpa: item.gpa ? item.gpa.toString() : "",
        startDate: item.startDate ? item.startDate.toISOString().split("T")[0] : "",
        endDate: item.endDate ? item.endDate.toISOString().split("T")[0] : "",
        isCurrentStudent: !item.endDate,
        description: item.description || "",
      }));
    }, [props.value]);

    // Handle changes from editor and transform back to EducationItem[]
    const handleChange = (data: Education | Education[]) => {
      const items = Array.isArray(data) ? data : [data];

      const transformed: EducationItem[] = items.map((item): EducationItem => {
        const safeParseDate = (value: string): Date | null => {
          const date = new Date(value);
          return isNaN(date.getTime()) ? null : date;
        };

        return {
          institution: item.schoolName,
          degree: item.degree,
          fieldOfStudy: item.major,
          startDate: item.startDate ? safeParseDate(item.startDate) : null,
          endDate: item.isCurrentStudent
            ? null
            : item.endDate
            ? safeParseDate(item.endDate)
            : null,
          location: null,
          gpa: item.gpa ? parseFloat(item.gpa) : null,
          description: item.description,
          achievements: null,
        };
      });

      props.onChange?.(transformed);
    };

    // Destructure and forward remaining props
    const { value, onChange, ...restProps } = props;

    return (
      <BaseEducationEditor
        {...restProps}
        value={transformedData}
        onChange={handleChange}
      />
    );
  }
);

EducationEditor.displayName = "EducationEditor";