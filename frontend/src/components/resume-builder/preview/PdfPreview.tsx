"use client";
// Fake PDF Renderer on the right panel

import React from "react";
import { useResumeStore } from "@/stores/resume-store";
import styles from "./PdfPreview.module.css";
import { renderSectionContent } from "@/utils/SectionRenderers";
import { Section } from "@/types/resume/sections";

const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, "").trim();
};

const hasContent = (type: string, content: string): boolean => {
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

export function PdfPreview() {
  const { sections } = useResumeStore();
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  // Use AI preview sections when in AI preview mode, otherwise use regular sections
  const displaySections = sections;

  const [zoom, setZoom] = React.useState(100);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50));
  };

  const handleResetZoom = () => {
    setZoom(100);
  };

  // Center scroll position when component mounts or zoom changes
  React.useEffect(() => {
    if (wrapperRef.current) {
      setTimeout(() => {
        const wrapper = wrapperRef.current;
        if (wrapper) {
          const { scrollWidth, clientWidth } = wrapper;
          wrapper.scrollLeft = (scrollWidth - clientWidth) / 2;
        }
      }, 0); // Wait for zoom transform to apply
    }
  }, [zoom]); // Re-center when zoom changes

  // Group sections into pages based on content
  const groupSectionsIntoPages = (sections: Section[]) => {
    const pages: Section[][] = [[]];
    let currentPage = 0;
    let sectionsWithContentOnCurrentPage = 0;

    sections.forEach((section) => {
      // Personal info always starts on first page
      if (section.type === "personal") {
        pages[0].push(section);
        return;
      }

      // Only count sections that have actual content
      if (hasContent(section.type, section.content)) {
        sectionsWithContentOnCurrentPage++;
      }

      // Check if current page has enough non-empty sections
      if (sectionsWithContentOnCurrentPage >= 3) {
        currentPage++;
        pages[currentPage] = [];
        sectionsWithContentOnCurrentPage = 0;
      }

      pages[currentPage].push(section);
    });

    // If we have empty pages at the end, remove them
    return pages.filter(page => page.some(section => 
      hasContent(section.type, section.content)
    ));
  };

  const pages = groupSectionsIntoPages(displaySections);

  return (
    <div className={styles.previewWrapper} ref={wrapperRef}>
      <div className={styles.innerWrapper}>
        <div className={styles.zoomControls}>
          <button onClick={handleZoomOut} className={styles.zoomButton}>
            -
          </button>
          <button onClick={handleResetZoom} className={styles.zoomButton}>
            {zoom}%
          </button>
          <button onClick={handleZoomIn} className={styles.zoomButton}>
            +
          </button>
        </div>
        <div
          className={styles.previewContainer}
          style={{ transform: `scale(${zoom / 120})` }}
        >
          {pages.map((pageSections, pageIndex) => (
            <div key={pageIndex} className={styles.page}>
              {pageSections.map((section) => (
                <div key={section.id} className={styles.sectionContainer}>
                  {section.type !== "personal" &&
                    hasContent(section.type, section.content) && (
                      <h2 className={styles.sectionHeader}>{section.header}</h2>
                    )}
                  <div className={styles.richTextContent}>
                    {renderSectionContent(section.type, section.content)}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}