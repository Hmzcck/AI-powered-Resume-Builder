"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/stores/resume-store";
import { useUIStore } from "@/stores/ui-store";
import { useAIStore } from "@/stores/ai-store";
import { Check, X } from "lucide-react";
import { PdfPreview } from "../../preview/PdfPreview";

export const AIPreviewTab = () => {
  const { updateFromAIContent } = useResumeStore();
  const { setAITab } = useUIStore();
  const { previewSections, clearPreview, isGenerating } = useAIStore();

  console.log("AIPreviewTab - Initial previewSections:", previewSections);

  const handleAcceptAI = () => {
    if (previewSections) {
      console.log("PreviewTab - Sections being passed to updateFromAIContent:", previewSections);
      updateFromAIContent(previewSections);
      console.log("PreviewTab - After updateFromAIContent call");
      clearPreview();
      setAITab("build");
    }
  };

  const handleDeclineAI = () => {
    clearPreview();
    setAITab("build");
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Preview Generated Resume</CardTitle>
        <CardDescription>
          Review the AI-generated content and choose to accept or decline the changes.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 relative min-h-0">
        {isGenerating ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="text-sm text-muted-foreground">Generating your resume...</p>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0">
            <PdfPreview isAIPreview />
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-6 flex justify-end space-x-2">
        <Button
          onClick={handleDeclineAI}
          variant="outline"
          className="w-32"
          disabled={isGenerating}
        >
          <X className="mr-2 h-4 w-4" />
          Decline
        </Button>
        <Button
          onClick={handleAcceptAI}
          className="w-32"
          disabled={isGenerating || !previewSections}
        >
          <Check className="mr-2 h-4 w-4" />
          Accept
        </Button>
      </CardFooter>
    </Card>
  );
};
