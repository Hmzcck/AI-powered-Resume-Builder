using System;
using AI_powered_Resume_Builder.Domain.AiFeedbacks;
using AI_powered_Resume_Builder.Infrastructure.Data.Context;
using Microsoft.EntityFrameworkCore;

namespace AI_powered_Resume_Builder.Infrastructure.Data.Repositories;

public class AiFeedbackRepository(ApplicationDbContext _context) : IAiFeedbackRepository
{
    public async Task<AiFeedback> CreateAsync(AiFeedback feedback)
    {
        await _context.AIFeedbacks.AddAsync(feedback);
        await _context.SaveChangesAsync();
        return feedback;
    }

    public async Task DeleteAsync(AiFeedback feedback)
    {
        _context.AIFeedbacks.Remove(feedback);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.AIFeedbacks.AnyAsync(f => f.Id == id);
    }

    public async Task<IEnumerable<AiFeedback>> GetAllAsync()
    {
        return await _context.AIFeedbacks
            .Include(f => f.Resume)
            .ToListAsync();
    }

    public async Task<AiFeedback> GetByIdAsync(Guid id)
    {
        return await _context.AIFeedbacks
            .Include(f => f.Resume)
            .FirstOrDefaultAsync(f => f.Id == id);
    }

    public async Task<IEnumerable<AiFeedback>> GetByResumeIdAsync(Guid resumeId)
    {
        return await _context.AIFeedbacks
            .Include(f => f.Resume)
            .Where(f => f.ResumeId == resumeId)
            .ToListAsync();
    }

    public async Task<IEnumerable<AiFeedback>> GetByUserIdAsync(Guid userId)
    {
        return await _context.AIFeedbacks
            .Include(f => f.Resume)
            .Where(f => f.Resume.ApplicationUserId == userId)
            .ToListAsync();
    }

    public async Task<AiFeedback> UpdateAsync(AiFeedback feedback)
    {
        _context.Entry(feedback).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return feedback;
    }
}