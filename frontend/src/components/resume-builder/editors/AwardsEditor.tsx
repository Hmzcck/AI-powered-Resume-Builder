"use client";
import { createEditor } from "./EditorFactory";
import React from "react";

// Internal format used by the editor UI
export type Award = {
  name: string;
  date: string;
  link: string;
  description: string;
};

// External format expected from and emitted to the app
export type AwardItem = {
  title: string | null;
  issuingOrganization: string | null;
  dateReceived: Date | null;
  description: string | null;
  category: string | null;
  level: string | null;
  url: string | null;
};

// Props for the editor component
export type AwardsEditorProps = {
  value?: AwardItem[];
  onChange?: (data: AwardItem[]) => void;
  [key: string]: unknown;
};

// Base editor configuration
const BaseAwardsEditor = createEditor<Award>({
  name: "award",
  emptyState: {
    name: "",
    date: "",
    link: "",
    description: "",
  },
  fields: {
    name: {
      type: "text",
      label: "Name",
      placeholder: "e.g., Best Innovation Award",
      colSpan: 2
    },
    date: {
      type: "date",
      label: "Date",
      colSpan: 1
    },
    link: {
      type: "url",
      label: "Link",
      placeholder: "https://example.com/award",
      colSpan: 1
    },
    description: {
      type: "richtext",
      label: "Description",
      colSpan: 2
    }
  },
  addButtonText: "Add Award",
  emptyMessage: "No awards added yet. Click the button below to add your awards and achievements."
});

// Main component
export const AwardsEditor = React.forwardRef<unknown, AwardsEditorProps>(
  (props, _ref) => {
    // Transform external value to internal Award format
    const transformedData: Award[] = React.useMemo(() => {
      const items = Array.isArray(props.value) ? props.value : [];
    
      if (items.length === 0) {
        return [
          {
            name: "",
            date: "",
            link: "",
            description: "",
          },
        ];
      }
      
      return items.map((item): Award => ({
        name: item.title || "",
        date: item.dateReceived ? item.dateReceived.toISOString().split("T")[0] : "",
        link: item.url || "",
        description: item.description || "",
      }));
    }, [props.value]);

    // Handle changes from editor and transform back to AwardItem[]
    const handleChange = (data: Award | Award[]) => {
      const items = Array.isArray(data) ? data : [data];

      const transformed: AwardItem[] = items.map((item): AwardItem => {
        const safeParseDate = (value: string): Date | null => {
          const date = new Date(value);
          return isNaN(date.getTime()) ? null : date;
        };

        return {
          title: item.name,
          issuingOrganization: "Not Specified", // Default value as it's required in the backend model
          dateReceived: item.date ? safeParseDate(item.date) : null,
          description: item.description,
          category: null,
          level: null,
          url: item.link || null,
        };
      });

      props.onChange?.(transformed);
    };

    // Destructure and forward remaining props
    const { value, onChange, ...restProps } = props;

    return (
      <BaseAwardsEditor
        {...restProps}
        value={transformedData}
        onChange={handleChange}
      />
    );
  }
);

AwardsEditor.displayName = "AwardsEditor";