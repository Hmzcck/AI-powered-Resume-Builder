namespace AI_powered_Resume_Builder.Domain.Resumes;

public interface IResumeRepository
{
    Task<Resume> GetByIdAsync(Guid id);
    Task<IEnumerable<Resume>> GetAllAsync();
    Task<IEnumerable<Resume>> GetByUserIdAsync(Guid userId);
    Task<Resume> CreateAsync(Resume resume);
    Task<Resume> UpdateAsync(Resume resume);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
}
