using AI_powered_Resume_Builder.Domain.Resumes.Sections;

namespace AI_powered_Resume_Builder.Domain.Resumes;

public interface IResumeRepository
{
    Task<Resume> CreateAsync(Resume resume);
    Task<Resume> UpdateAsync(Resume resume);
    Task DeleteAsync(Guid id);
    Task<Resume> GetByIdAsync(Guid id);
    Task<Resume> GetByUserIdAndIdAsync(Guid userId, Guid id);
    Task<IEnumerable<Resume>> GetByUserIdAsync(Guid userId);
    Task<IEnumerable<Resume>> GetAllAsync();
    Task<bool> ExistsAsync(Guid id);

    // Section management methods
    Task<T> AddSectionAsync<T>(T section) where T : ResumeSection;
    Task<T> UpdateSectionAsync<T>(T section) where T : ResumeSection;
    Task DeleteSectionAsync<T>(Guid sectionId) where T : ResumeSection;
}
