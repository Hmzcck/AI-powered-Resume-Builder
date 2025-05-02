import { Section } from "@/types/resume/sections";

/**
 * Strips HTML tags from a string
 */
export const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, "").trim();
};

/**
 * Checks if a section has valid content
 */
import type {
  ExperienceDto,
  EducationDto,
  SkillDto,
  ProjectDto,
  CertificationDto,
  LanguageDto,
  AwardDto,
  PublicationDto,
  ReferenceDto,
} from "@/types/resume/models";

type PersonalInfo = {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
};

type SectionContent =
  | string
  | PersonalInfo
  | ExperienceDto[]
  | EducationDto[]
  | SkillDto[]
  | ProjectDto[]
  | CertificationDto[]
  | LanguageDto[]
  | AwardDto[]
  | ReferenceDto[]
  | PublicationDto[];

export const hasContent = (type: string, content: SectionContent): boolean => {
  if (!content) return false;

  // For array-based sections
  if (Array.isArray(content)) {
    return content.length > 0;
  }

  // For personal info section
  if (type === "personal" && typeof content === "object") {
    return Object.values(content).some(
      (val) => val && String(val).trim() !== ""
    );
  }

  // For string content (either HTML or plain text)
  if (typeof content === "string") {
    return stripHtml(content) !== "";
  }

  return false;
};

/**
 * Estimates content size in lines based on section type and content
 */
export const estimateContentSize = (section: Section): number => {
  const { type, content } = section;
  
  if (!content) {
    return 0;
  }

  let estimatedLines = 0;
  
  // Header takes at least one line
  if (type !== "personal") {
    estimatedLines += 2; // Section header + spacing
  }

  // For array content, estimate based on item count and typical item size
  if (Array.isArray(content)) {
    const linesPerItem = 
      type === "experience" ? 10 :
      type === "education" ? 7 :
      type === "projects" ? 8 :
      type === "references" || type === "publications" ? 5 :
      3; // Default for other array-based sections

    estimatedLines += content.length * linesPerItem;
  }
  // For personal info (typically at top)
  else if (type === "personal") {
    estimatedLines += 3;
  }
  // For text content (summary, skills)
  else if (typeof content === "string") {
    // Estimate 1 line per ~80 characters, with a minimum of 2 lines
    const textLength = stripHtml(content).length;
    estimatedLines += Math.max(2, Math.ceil(textLength / 80));
  }
  
  return estimatedLines;
};

/**
 * Groups sections into pages based on content size for A4 paper simulation
 */
export const groupSectionsIntoPages = (sections: Section[]): Section[][] => {
  const pages: Section[][] = [[]];
  let currentPage = 0;
  
  // A4 page can fit approximately 50-55 lines of text with normal font size
  // Accounting for margins and spacing
  const LINES_PER_PAGE = 45;
  let linesUsedOnCurrentPage = 0;

  sections.forEach((section) => {
    // Personal info always starts on first page
    if (section.type === "personal") {
      pages[0].push(section);
      linesUsedOnCurrentPage += estimateContentSize(section);
      return;
    }

    // Skip empty sections
    if (!hasContent(section.type, section.content)) {
      return;
    }

    const sectionSize = estimateContentSize(section);
    
    // If adding this section would exceed page capacity, start a new page
    if (linesUsedOnCurrentPage + sectionSize > LINES_PER_PAGE) {
      currentPage++;
      pages[currentPage] = [section];
      linesUsedOnCurrentPage = sectionSize;
    } else {
      // Otherwise add to current page
      pages[currentPage].push(section);
      linesUsedOnCurrentPage += sectionSize;
    }
  });

  // If we have empty pages, remove them
  return pages.filter(page => page.length > 0);
};
