"use client";
import { createEditor } from "./EditorFactory";
import React from "react";

// Internal format used by the editor UI
export type Language = {
  name: string;
  proficiency: string;
};

// External format expected from and emitted to the app
export type LanguageItem = {
  name: string | null;
  proficiencyLevel: string | null;
  certification: string | null;
  additionalInfo: string | null;
  speaking: number | null;
  writing: number | null;
  reading: number | null;
  listening: number | null;
};

// Props for the editor component
export type LanguagesEditorProps = {
  value?: LanguageItem[];
  onChange?: (data: LanguageItem[]) => void;
  [key: string]: unknown;
};

const proficiencyLevels = [
  "Native",
  "Fluent",
  "Professional",
  "Intermediate",
  "Basic",
];

const BaseLanguagesEditor = createEditor<Language>({
  name: "language",
  emptyState: {
    name: "",
    proficiency: "",
  },
  fields: {
    name: {
      type: "text",
      label: "Language Name",
      placeholder: "e.g., English, Spanish",
      colSpan: 1
    },
    proficiency: {
      type: "select",
      label: "Proficiency Level",
      placeholder: "Select proficiency level",
      options: proficiencyLevels,
      colSpan: 1
    }
  },
  addButtonText: "Add Language",
  emptyMessage: "No languages added yet. Click the button below to add a language."
});

// Main component
export const LanguagesEditor = React.forwardRef<unknown, LanguagesEditorProps>(
  (props, _ref) => {
    // Transform external value to internal Language format
    const transformedData: Language[] = React.useMemo(() => {
      const items = Array.isArray(props.value) ? props.value : [];
    
      if (items.length === 0) {
        return [
          {
            name: "",
            proficiency: "",
          },
        ];
      }
      
      return items.map((item): Language => ({
        name: item.name || "",
        proficiency: item.proficiencyLevel || "",
      }));
    }, [props.value]);

    // Handle changes from editor and transform back to LanguageItem[]
    const handleChange = (data: Language | Language[]) => {
      const items = Array.isArray(data) ? data : [data];

      const transformed: LanguageItem[] = items.map((item): LanguageItem => {
        return {
          name: item.name,
          proficiencyLevel: item.proficiency,
          certification: null,
          additionalInfo: null,
          speaking: null,
          writing: null,
          reading: null,
          listening: null,
        };
      });

      props.onChange?.(transformed);
    };

    // Destructure and forward remaining props
    const { value, onChange, ...restProps } = props;

    return (
      <BaseLanguagesEditor
        {...restProps}
        value={transformedData}
        onChange={handleChange}
      />
    );
  }
);

LanguagesEditor.displayName = "LanguagesEditor";