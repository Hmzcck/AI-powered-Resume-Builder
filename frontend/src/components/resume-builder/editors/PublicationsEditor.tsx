"use client";
import { createEditor } from "./EditorFactory";
import React from "react";

// Internal format used by the editor UI
export type Publication = {
  title: string;
  authors: string;
  venue: string;
  publicationDate: string;
  doi: string;
  description: string;
};

// External format expected from and emitted to the app
export type PublicationItem = {
  title: string | null;
  authors: string | null;
  publisher: string | null;
  publicationDate: Date | null;
  description: string | null;
  DOI: string | null;
  URL: string | null;
  type?: string | null;
  citation?: string | null;
  impact?: string | null;
};

// Props for the editor component
export type PublicationsEditorProps = {
  value?: PublicationItem[];
  onChange?: (data: PublicationItem[]) => void;
  [key: string]: unknown;
};

// Base editor configuration
const BasePublicationsEditor = createEditor<Publication>({
  name: "publication",
  emptyState: {
    title: "",
    authors: "",
    venue: "",
    publicationDate: "",
    doi: "",
    description: "",
  },
  fields: {
    title: {
      type: "text",
      label: "Title",
      placeholder: "Publication Title",
      colSpan: 2
    },
    authors: {
      type: "text",
      label: "Authors",
      placeholder: "e.g., John Doe, Jane Smith",
      colSpan: 1
    },
    venue: {
      type: "text",
      label: "Journal/Conference",
      placeholder: "e.g., Journal of Computer Science",
      colSpan: 1
    },
    publicationDate: {
      type: "date",
      label: "Publication Date",
      colSpan: 1
    },
    doi: {
      type: "text",
      label: "DOI/URL",
      placeholder: "e.g., 10.1000/xyz123",
      colSpan: 1
    },
    description: {
      type: "richtext",
      label: "Description",
      colSpan: 2
    }
  },
  addButtonText: "Add Publication",
  emptyMessage: "No publications added yet. Click the button below to add your publications."
});

// Main component
export const PublicationsEditor = React.forwardRef<unknown, PublicationsEditorProps>(
  (props, _ref) => {
    // Transform external value to internal Publication format
    const transformedData: Publication[] = React.useMemo(() => {
      const items = Array.isArray(props.value) ? props.value : [];
    
      if (items.length === 0) {
        return [
          {
            title: "",
            authors: "",
            venue: "",
            publicationDate: "",
            doi: "",
            description: "",
          },
        ];
      }
      
      return items.map((item): Publication => ({
        title: item.title || "",
        authors: item.authors || "",
        venue: item.publisher || "",
        publicationDate: item.publicationDate ? item.publicationDate.toISOString().split("T")[0] : "",
        doi: item.DOI || item.URL || "",
        description: item.description || "",
      }));
    }, [props.value]);

    // Handle changes from editor and transform back to PublicationItem[]
    const handleChange = (data: Publication | Publication[]) => {
      const items = Array.isArray(data) ? data : [data];

      const transformed: PublicationItem[] = items.map((item): PublicationItem => {
        const safeParseDate = (value: string): Date | null => {
          const date = new Date(value);
          return isNaN(date.getTime()) ? null : date;
        };

        return {
          title: item.title,
          authors: item.authors,
          publisher: item.venue,
          publicationDate: item.publicationDate ? safeParseDate(item.publicationDate) : null,
          description: item.description,
          DOI: item.doi,
          URL: null,
          type: null,
          citation: null,
          impact: null,
        };
      });

      props.onChange?.(transformed);
    };

    // Destructure and forward remaining props
    const { value, onChange, ...restProps } = props;

    return (
      <BasePublicationsEditor
        {...restProps}
        value={transformedData}
        onChange={handleChange}
      />
    );
  }
);

PublicationsEditor.displayName = "PublicationsEditor";