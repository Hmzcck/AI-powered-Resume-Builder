"use client";
import { useResumeStore } from "@/stores/resume-store";
import { Section } from "@/types/resume/sections";
import { resumeService } from "@/services/resume-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Save, FileDown } from "lucide-react";

const saveResume = async (sections: Section[], title: string) => {
  // Filter out personal information section and convert remaining sections to JSON
  const contentSections = sections
    .filter((section) => section.type !== "personal")
    .map(({ type, header, content }) => ({ type, header, content }));

  const payload = {
    title,
    content: JSON.stringify(contentSections),
    score: 0,
    keywords: [],
    targetJobDescriptions: [],
  };

  const response = await resumeService.createResume(payload);
  if (!response.ok) {
    throw new Error("Failed to save resume");
  }
  alert("Resume saved successfully!");
};

export const ResumeInnerNavbar = () => {
  const { sections, title, setTitle } = useResumeStore();

  return (
    <TooltipProvider>
      <nav className="border-b border-border p-4 bg-card">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4 flex-1">
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Resume Title"
              className="max-w-xs"
            />
            <div className="flex-1"></div>
          </div>

          <div className="flex items-center">
            <Separator orientation="vertical" className="mx-4 h-6" />
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={() => saveResume(sections, title)} 
                    variant="outline"
                    size="icon"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save Resume</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    // onClick={() => generateAndViewPdf(sections)}
                    variant="default"
                    size="icon"
                  >
                    <FileDown className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download PDF</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </nav>
    </TooltipProvider>
  );
};
