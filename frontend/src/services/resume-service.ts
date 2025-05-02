const API_URL = "http://localhost:5235/api";

import { AiFeedbackDto, ResumeDto } from "@/types/resume/models";
import { ResumeFormData } from "@/lib/validations/resume";

export const resumeService = {
  async getResumeById(id: string) {
    try {
      const response = await fetch(`${API_URL}/Resume/GetResumeById/${id}`);

      return response.json();
    } catch (error) {
      console.error("Failed to fetch resume", error);
      throw error;
    }
  },
  async createResume(resume: ResumeFormData) {
    try {
      const response = await fetch(`${API_URL}/Resume/CreateResume`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resume }),
      });

      return response.json();
    } catch (error) {
      console.error("Failed to create resume", error);
      throw error;
    }
  },
  async GenerateResumeSection(sectionTitle: string, resumeContent: ResumeDto): Promise<ResumeDto> {
    try {
      const response = await fetch(`${API_URL}/Ai/generate-resume-section`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          sectionTitle, 
          resumeContent 
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate AI content");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error generating AI content:", error);
      throw error;
    }
  },
  async GenerateResume(prompt: string): Promise<ResumeDto> {
    try {
      const response = await fetch(`${API_URL}/Ai/generate-resume`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate resume");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error generating resume:", error);
      throw error;
    }
  },
  async CalculateResumeScore(resumeContent: ResumeDto): Promise<number> {
    try {
      const response = await fetch(`${API_URL}/Ai/calculate-score`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resumeContent),
      });

      if (!response.ok) {
        throw new Error("Failed to calculate score");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error calculating score:", error);
      throw error;
    }
  },
  async GenerateFeedback(resumeId: string): Promise<AiFeedbackDto> {
    try {
      const response = await fetch(
        `${API_URL}/Ai/generate-feedback/${resumeId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ resumeId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate feedback");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error generating feedback:", error);
      throw error;
    }
  },
  async GenerateResumeFromJobDescription(
    content: ResumeDto,
    jobDescriptions: string[],
    useCurrentResumeInfo: boolean = false
  ): Promise<ResumeDto> {
    try {
      const response = await fetch(`${API_URL}/Ai/generate-resume-from-jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          jobDescriptions,
          useCurrentResumeInfo,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to generate resume from job descriptions");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error generating feedback:", error);
      throw error;
    }
  },
};
