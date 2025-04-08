"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAIStore } from "@/stores/ai-store";
import { useResumeStore } from "@/stores/resume-store";
import { useUIStore } from "@/stores/ui-store";
import { Briefcase, Loader2, Plus, X } from "lucide-react";

export const AITargetTab = () => {
  const {
    jobDescriptions,
    addJobDescription,
    updateJobDescription,
    removeJobDescription,
    generateFromJobs,
    isGenerating,
  } = useAIStore();
  const { sections } = useResumeStore();
  const { setAITab } = useUIStore();

  const handleGenerateResume = async () => {
    try {
      await generateFromJobs(sections, true);
      setAITab("preview");
    } catch (error) {
      console.error("Error generating resume from jobs:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Briefcase className="h-5 w-5" />
          <CardTitle>Target Jobs</CardTitle>
        </div>
        <CardDescription>
          Add job descriptions to generate a resume tailored to specific positions.
          The AI will analyze the requirements and optimize your resume accordingly.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {jobDescriptions.map((description, index) => (
          <Card key={index} className="relative">
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm">Job Description {index + 1}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeJobDescription(index)}
                  disabled={jobDescriptions.length === 1}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove job description</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <Textarea
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  updateJobDescription(index, e.target.value)
                }
                placeholder="Paste the job description here..."
                className="min-h-[200px] resize-none"
              />
            </CardContent>
          </Card>
        ))}

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={addJobDescription}
            disabled={isGenerating}
            className="flex-1"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Job Description
          </Button>
          <Button
            onClick={handleGenerateResume}
            disabled={
              isGenerating ||
              !jobDescriptions.some((desc) => desc.trim())
            }
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Optimizing...
              </>
            ) : (
              "Generate Optimized Resume"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
