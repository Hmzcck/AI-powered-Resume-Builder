"use client";
import { createEditor } from "./EditorFactory";
import React from "react";

// Internal format used by the editor UI
export type Certification = {
  name: string;
  issuer: string;
  link: string;
  date: string;
  description: string;
};

// External format expected from and emitted to the app
export type CertificationItem = {
  name: string | null;
  issuingOrganization: string | null;
  issueDate: Date | null;
  expiryDate?: Date | null;
  credentialId: string | null;
  credentialUrl: string | null;
};

// Props for the editor component
export type CertificationsEditorProps = {
  value?: CertificationItem[];
  onChange?: (data: CertificationItem[]) => void;
  [key: string]: unknown;
};

// Base editor configuration
const BaseCertificationsEditor = createEditor<Certification>({
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

// Main component
export const CertificationsEditor = React.forwardRef<unknown, CertificationsEditorProps>(
  (props, _ref) => {
    // Transform external value to internal Certification format
    const transformedData: Certification[] = React.useMemo(() => {
      const items = Array.isArray(props.value) ? props.value : [];
    
      if (items.length === 0) {
        return [
          {
            name: "",
            issuer: "",
            link: "",
            date: "",
            description: "",
          },
        ];
      }
      
      return items.map((item): Certification => ({
        name: item.name || "",
        issuer: item.issuingOrganization || "",
        link: item.credentialUrl || "",
        date: item.issueDate ? item.issueDate.toISOString().split("T")[0] : "",
        description: "",
      }));
    }, [props.value]);

    // Handle changes from editor and transform back to CertificationItem[]
    const handleChange = (data: Certification | Certification[]) => {
      const items = Array.isArray(data) ? data : [data];

      const transformed: CertificationItem[] = items.map((item): CertificationItem => {
        const safeParseDate = (value: string): Date | null => {
          const date = new Date(value);
          return isNaN(date.getTime()) ? null : date;
        };

        return {
          name: item.name,
          issuingOrganization: item.issuer,
          issueDate: item.date ? safeParseDate(item.date) : null,
          expiryDate: null,
          credentialId: null,
          credentialUrl: item.link || null,
        };
      });

      props.onChange?.(transformed);
    };

    // Destructure and forward remaining props
    const { value, onChange, ...restProps } = props;

    return (
      <BaseCertificationsEditor
        {...restProps}
        value={transformedData}
        onChange={handleChange}
      />
    );
  }
);

CertificationsEditor.displayName = "CertificationsEditor";