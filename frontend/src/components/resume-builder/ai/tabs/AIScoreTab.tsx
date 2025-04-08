import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAIStore } from "@/stores/ai-store";
import { useResumeStore } from "@/stores/resume-store";
import { useUIStore } from "@/stores/ui-store";

export const AIScoreTab = () => {
  const { score, feedback, calculateScore, generateFeedback, isScoringResume, isGeneratingFeedback } =
    useAIStore();
  const { sections, resumeId } = useResumeStore();
  const { setAITab } = useUIStore();

  const handleCalculateScore = async () => {
    try {
      await calculateScore(sections);
    } catch (error) {
      console.error("Error calculating score:", error);
    }
  };

  const handleGetFeedback = async () => {
    if (!resumeId || !resumeId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      console.error("No resume ID found");
      return;
    }

    try {
      await generateFeedback(resumeId as `${string}-${string}-${string}-${string}-${string}`);
    } catch (error) {
      console.error("Error getting feedback:", error);
    }
  };

  const handleViewImprovedResume = () => {
    if (feedback?.improvements) {
      setAITab("preview");
    }
  };

  return (
    <Card className="p-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Resume Score Calculator</CardTitle>
          <Button onClick={handleCalculateScore} disabled={isScoringResume}>
            {isScoringResume ? "Calculating..." : "Calculate Score"}
          </Button>
        </div>
      </CardHeader>

      {score !== null && (
        <CardContent className="space-y-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold mb-4">{score}/100</div>
              <CardDescription className="mb-4">
                This score indicates how well your resume is optimized for job applications.
              </CardDescription>
              <Button
                onClick={handleGetFeedback}
                variant="outline"
                disabled={isGeneratingFeedback}
              >
                {isGeneratingFeedback ? "Getting Feedback..." : "Get Feedback"}
              </Button>
            </CardContent>
          </Card>

          {feedback && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {feedback.insights}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Missing Keywords</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {feedback.missingKeywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleViewImprovedResume}
                className="w-full"
                disabled={!feedback.improvements}
                variant="default"
              >
                View Improved Resume
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
