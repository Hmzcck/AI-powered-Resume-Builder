const API_URL = "http://localhost:5235/api";

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
};
