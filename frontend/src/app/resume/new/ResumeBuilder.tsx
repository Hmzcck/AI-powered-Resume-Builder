"use client";

import { useEffect, useRef, useState } from "react";
import { useResumeStore } from "@/stores/resume-store";
import { ResumeInnerNavbar } from "@/components/resume-builder/ResumeInnerNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ResumeFormSections } from "@/components/resume-builder/ResumeFormSections";
import { PdfPreview } from "@/components/resume-builder/preview/PdfPreview";
import { AIPanel } from "@/components/resume-builder/ai/AIPanel";

interface ResumeBuilderProps {
  resumeId?: string;
}
function SectionBuilderSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Section Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4"></CardContent>
    </Card>
  );
}

function PDFPreviewSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <PdfPreview />
      </CardContent>
    </Card>
  );
}

function AIPanelSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>AI Assistant</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );
}

export function ResumeBuilder({ resumeId }: Readonly<ResumeBuilderProps>) {
  const loadResume = useResumeStore((state) => state.loadResume);

  useEffect(() => {
    if (resumeId) {
      loadResume(resumeId).catch((error) => {
        console.error("Failed to load resume:", error);
      });
    }
  }, [resumeId, loadResume]);

  return (
    <div className="h-screen flex flex-col">
      <ResumeInnerNavbar />

      <div className="flex flex-1 overflow-hidden bg-muted/10">
        {/* Main Content - Interactive Builder */}
        <div className="w-1/3 p-6 overflow-y-auto border-r">
          <ResumeFormSections />
        </div>

        {/* Middle Panel - Dynamic Content */}
        <div className="w-1/3 p-6 overflow-y-auto border-r">
          <PdfPreview />
        </div>

        {/* Right Panel - AI Part */}
        <div className="w-1/3 p-6 overflow-y-auto">
          <AIPanel/>
        </div>
      </div>
    </div>
  );
}
