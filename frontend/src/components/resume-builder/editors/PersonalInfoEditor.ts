"use client";
import { createEditor } from "./EditorFactory";

export type PersonalInfo = {
  name: string;
  email: string;
  phone: string;
  location: string;
  website: string;
};

export const PersonalInfoEditor = createEditor<PersonalInfo>({
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
