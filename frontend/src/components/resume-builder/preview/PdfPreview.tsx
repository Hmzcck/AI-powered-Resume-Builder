"use client";
// Fake PDF Renderer on the right panel

import React from "react";
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/stores/resume-store";
import { useAIStore } from "@/stores/ai-store";
import styles from "./PdfPreview.module.css";
import { renderSectionContent } from "@/utils/SectionRenderers";
import { groupSectionsIntoPages } from "@/utils/PdfPagination";
import { Minus, Plus } from "lucide-react";
import type { Section } from "@/types/resume/sections";
interface PdfPreviewProps {
  isAIPreview?: boolean;
}

export function PdfPreview({ isAIPreview = false }: PdfPreviewProps) {
  const { sections } = useResumeStore();
  const aiStore = useAIStore();
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  // Use AI preview sections when in AI preview mode, otherwise use regular sections
  const displaySections: Section[] = isAIPreview ? aiStore.previewSections ?? [] : sections;

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

  // Filter out empty sections
  const nonEmptySections = displaySections.filter(section => {
    if (typeof section.content === 'string') {
      return section.content.trim() !== '';
    }
    if (Array.isArray(section.content)) {
      return section.content.length > 0;
    }
    if (section.type === 'personal' && typeof section.content === 'object') {
      return Object.values(section.content).some(val => val && String(val).trim() !== '');
    }
    return false;
  });

  const pages = groupSectionsIntoPages(nonEmptySections);
  return (
    <div className={styles.previewWrapper} ref={wrapperRef}>
      <div className={styles.innerWrapper}>
        <div className="flex items-center gap-2 absolute right-4 top-4 bg-background/80 backdrop-blur-sm p-2 rounded-lg border shadow-sm">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleZoomOut}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleResetZoom}
            className="min-w-[4rem]"
          >
            {zoom}%
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleZoomIn}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div
          className={styles.previewContainer}
          style={{ transform: `scale(${zoom / 120})` }}
        >
          {pages.map((pageSections, pageIndex) => (
            <div key={pageIndex} className={styles.page}>
              {pageSections.map((section) => (
                <div key={section.id} className={styles.sectionContainer}>
                  {section.type !== "personal" && (
                    <h2 className={styles.sectionHeader}>{section.header}</h2>
                  )}
                  <div className={styles.richTextContent}>
                    {renderSectionContent(section)}
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
