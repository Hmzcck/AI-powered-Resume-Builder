namespace AI_powered_Resume_Builder.Domain.AiFeedbacks;

public interface IAiFeedbackRepository
{
    Task<AiFeedback> GetByIdAsync(Guid id);
    Task<IEnumerable<AiFeedback>> GetAllAsync();
    Task<IEnumerable<AiFeedback>> GetByResumeIdAsync(Guid resumeId);
    Task<IEnumerable<AiFeedback>> GetByUserIdAsync(Guid userId);
    Task<AiFeedback> CreateAsync(AiFeedback feedback);
    Task<AiFeedback> UpdateAsync(AiFeedback feedback);
    Task DeleteAsync(AiFeedback feedback);
    Task<bool> ExistsAsync(Guid id);
}