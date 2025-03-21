export type SectionType =
  | "personal"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "languages"
  | "awards"
  | "references"
  | "publications";

export type Section = {
  id: string;
  type: SectionType;
  header: string;
  content: string;
  isLoading?: boolean;
};

