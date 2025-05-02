"use client";
import { createEditor } from "./EditorFactory";
import React from "react";

// Internal format used by the editor UI
export type PersonalInfo = {
  name: string;
  email: string;
  phone: string;
  location: string;
  website: string;
};

// External format expected from and emitted to the app
export type PersonalInfoItem = {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  website: string | null;
  linkedin: string | null;
  github: string | null;
  otherSocialMedia: string | null;
};

// Props for the editor component
export type PersonalInfoEditorProps = {
  value?: PersonalInfoItem;
  onChange?: (data: PersonalInfoItem) => void;
  [key: string]: unknown;
};

// Base editor configuration
const BasePersonalInfoEditor = createEditor<PersonalInfo>({
  name: "personal info",
  emptyState: {
    name: "",
    email: "",
    phone: "",
    location: "",
    website: "",
  },
  fields: {
    name: {
      type: "text",
      label: "Full Name",
      placeholder: "John Doe",
      colSpan: 1
    },
    email: {
      type: "email",
      label: "Email",
      placeholder: "john.doe@example.com",
      colSpan: 1
    },
    phone: {
      type: "tel",
      label: "Phone",
      placeholder: "+1 234 567 8900",
      colSpan: 1
    },
    location: {
      type: "text",
      label: "Location",
      placeholder: "City, Country",
      colSpan: 1
    },
    website: {
      type: "url",
      label: "Website",
      placeholder: "https://example.com",
      colSpan: 2
    }
  },
  singleItem: true, // This ensures no add/delete buttons and single-object JSON
  addButtonText: "", // Not used when singleItem is true
  emptyMessage: "No personal info added yet." // Not typically shown since there's always one item
});

// Main component
export const PersonalInfoEditor = React.forwardRef<unknown, PersonalInfoEditorProps>(
  (props, _ref) => {
    // Transform external value to internal PersonalInfo format
    const transformedData: PersonalInfo = React.useMemo(() => {
      const item = props.value || {};
      
      return {
        name: item.fullName || "",
        email: item.email || "",
        phone: item.phone || "",
        location: [item.city, item.state, item.country].filter(Boolean).join(", ") || "",
        website: item.website || item.linkedin || item.github || "",
      };
    }, [props.value]);

    // Handle changes from editor and transform back to PersonalInfoItem
    const handleChange = (data: PersonalInfo | PersonalInfo[]) => {
      // Ensure we have a single item even if an array is returned
      const item = Array.isArray(data) ? data[0] : data;

      const transformed: PersonalInfoItem = {
        fullName: item.name,
        email: item.email,
        phone: item.phone,
        address: null,
        city: item.location.split(",")[0]?.trim() || null,
        state: item.location.split(",")[1]?.trim() || null,
        zipCode: null,
        country: item.location.split(",")[2]?.trim() || null,
        website: item.website,
        linkedin: null,
        github: null,
        otherSocialMedia: null,
      };

      props.onChange?.(transformed);
    };

    // Destructure and forward remaining props
    const { value, onChange, ...restProps } = props;

    return (
      <BasePersonalInfoEditor
        {...restProps}
        value={transformedData}
        onChange={handleChange}
      />
    );
  }
);

PersonalInfoEditor.displayName = "PersonalInfoEditor";
