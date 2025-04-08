import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAIStore } from "@/stores/ai-store";
import { useUIStore } from "@/stores/ui-store";
import { Loader2 } from "lucide-react";

export const AIBuildTab = () => {
  const { prompt, setPrompt, generateResume, isGenerating } = useAIStore();
  const { setAITab } = useUIStore();

  const handleGenerateResume = async () => {
    if (!prompt.trim()) return;

    try {
      await generateResume(prompt);
      setAITab("preview");
    } catch (error) {
      console.error("Error generating resume:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Build with AI</CardTitle>
        <CardDescription>
          Enter a prompt to generate your resume using AI. Be specific about your experience,
          skills, and the type of position you're targeting.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <Textarea
            value={prompt}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
            placeholder="Enter your prompt for AI resume generation..."
            className="min-h-[200px] resize-none"
          />
          <Button
            onClick={handleGenerateResume}
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Resume"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
