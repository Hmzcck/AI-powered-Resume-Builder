"use client";
import { createEditor } from "./EditorFactory";
import React from "react";

// Internal format used by the editor UI
export type Reference = {
  fullName: string;
  jobTitle: string;
  company: string;
  email: string;
  phone: string;
  relationship: string;
  additionalInfo: string;
};

// External format expected from and emitted to the app
export type ReferenceItem = {
  name: string | null;
  title: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  relationship: string | null;
  additionalInfo: string | null;
};

// Props for the editor component
export type ReferencesEditorProps = {
  value?: ReferenceItem[];
  onChange?: (data: ReferenceItem[]) => void;
  [key: string]: unknown;
};

// Base editor configuration
const BaseReferencesEditor = createEditor<Reference>({
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

// Main component
export const ReferencesEditor = React.forwardRef<unknown, ReferencesEditorProps>(
  (props, _ref) => {
    // Transform external value to internal Reference format
    const transformedData: Reference[] = React.useMemo(() => {
      const items = Array.isArray(props.value) ? props.value : [];
    
      if (items.length === 0) {
        return [
          {
            fullName: "",
            jobTitle: "",
            company: "",
            email: "",
            phone: "",
            relationship: "",
            additionalInfo: "",
          },
        ];
      }
      
      return items.map((item): Reference => ({
        fullName: item.name || "",
        jobTitle: item.title || "",
        company: item.company || "",
        email: item.email || "",
        phone: item.phone || "",
        relationship: item.relationship || "",
        additionalInfo: item.additionalInfo || "",
      }));
    }, [props.value]);

    // Handle changes from editor and transform back to ReferenceItem[]
    const handleChange = (data: Reference | Reference[]) => {
      const items = Array.isArray(data) ? data : [data];

      const transformed: ReferenceItem[] = items.map((item): ReferenceItem => {
        return {
          name: item.fullName,
          title: item.jobTitle,
          company: item.company,
          email: item.email,
          phone: item.phone,
          relationship: item.relationship,
          additionalInfo: item.additionalInfo,
        };
      });

      props.onChange?.(transformed);
    };

    // Destructure and forward remaining props
    const { value, onChange, ...restProps } = props;

    return (
      <BaseReferencesEditor
        {...restProps}
        value={transformedData}
        onChange={handleChange}
      />
    );
  }
);

ReferencesEditor.displayName = "ReferencesEditor";