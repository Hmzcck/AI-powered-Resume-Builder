"use client";
// Fake PDF Renderer on the right panel

import React from "react";
import { useResumeStore } from "@/stores/resume-store";
import styles from "./PdfPreview.module.css";
import { renderSectionContent } from "@/utils/SectionRenderers";
import { Section } from "@/types/resume/sections";
import { hasContent, groupSectionsIntoPages } from "@/utils/PdfPagination";

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