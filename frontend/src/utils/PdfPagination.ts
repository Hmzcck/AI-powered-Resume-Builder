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
export const hasContent = (type: string, content: string): boolean => {
  try {
    if (!content) return false;

    // For structured content sections
    if (
      [
        "education",
        "experience",
        "projects",
        "certifications",
        "languages",
        "awards",
        "publications",
        "references",
      ].includes(type)
    ) {
      const parsed = JSON.parse(content);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      return items.length > 0;
    }

    // For personal info section
    if (type === "personal") {
      const info = JSON.parse(content);
      return Object.values(info).some(
        (val) => val && String(val).trim() !== ""
      );
    }

    // For rich text sections (summary, skills)
    // Remove HTML tags and check if there's any text content
    return stripHtml(content) !== "";
  } catch {
    return false;
  }
};

/**
 * Estimates content size in lines based on section type and content
 */
export const estimateContentSize = (section: Section): number => {
  try {
    const { type, content } = section;
    
    if (!content || !hasContent(type, content)) {
      return 0;
    }

    // Basic line count from text
    let estimatedLines = 0;
    
    // Header takes at least one line
    if (type !== "personal") {
      estimatedLines += 2; // Section header + spacing
    }

    // For structured content, estimate based on item count and typical item size
    if (["education", "experience", "projects"].includes(type)) {
      try {
        const parsed = JSON.parse(content);
        const items = Array.isArray(parsed) ? parsed : [parsed];
        
        // Estimate each item takes ~7-10 lines depending on section type
        const linesPerItem = type === "experience" ? 10 : 
                            type === "education" ? 7 : 
                            type === "projects" ? 8 : 6;
        
        estimatedLines += items.length * linesPerItem;
      } catch {
        // Fallback for unparseable content
        estimatedLines += 5;
      }
    } 
    // For smaller structured sections
    else if (["certifications", "languages", "awards", "references", "publications"].includes(type)) {
      try {
        const parsed = JSON.parse(content);
        const items = Array.isArray(parsed) ? parsed : [parsed];
        
        // Estimate each item takes ~3-5 lines
        const linesPerItem = type === "references" ? 5 : 
                            type === "publications" ? 5 : 3;
                            
        estimatedLines += items.length * linesPerItem;
      } catch {
        estimatedLines += 3;
      }
    }
    // For personal info (typically at top)
    else if (type === "personal") {
      estimatedLines += 3;
    }
    // For text content (summary, skills)
    else {
      // Estimate 1 line per ~80 characters, with a minimum of 2 lines
      const textLength = stripHtml(content).length;
      estimatedLines += Math.max(2, Math.ceil(textLength / 80));
    }
    
    return estimatedLines;
  } catch {
    // Default fallback if estimation fails
    return 3;
  }
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