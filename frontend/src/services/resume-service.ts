const API_URL = "http://localhost:5235/api";

export const resumeService = {
  async getResumeById(id: string) {
    try {
      const response = await fetch(`${API_URL}/Resume/GetResumeById/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch resume");
      }

      return response.json();
    } catch (error) {
      console.error("Failed to fetch resume", error);
      throw error;
    }
  },
};
