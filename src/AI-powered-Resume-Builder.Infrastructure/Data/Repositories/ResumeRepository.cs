using AI_powered_Resume_Builder.Domain.Resumes;
using AI_powered_Resume_Builder.Infrastructure.Data.Context;
using Microsoft.EntityFrameworkCore;

namespace AI_powered_Resume_Builder.Infrastructure.Data.Repositories;

public class ResumeRepository(ApplicationDbContext _context) : IResumeRepository
{
    public async Task<Resume> CreateAsync(Resume resume)
    {
        await _context.Resumes.AddAsync(resume);
        await _context.SaveChangesAsync();
        return resume;
    }

    public async Task DeleteAsync(Guid id)
    {
        var resume = await _context.Resumes.FindAsync(id);
        if (resume != null)
        {
            _context.Resumes.Remove(resume);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Resumes.AnyAsync(r => r.Id == id);
    }

    public async Task<IEnumerable<Resume>> GetAllAsync()
    {
        return await _context.Resumes
            .Include(r => r.AiFeedback)
            .ToListAsync();
    }

    public async Task<Resume> GetByIdAsync(Guid id)
    {
        return await _context.Resumes
            .Include(r => r.AiFeedback)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<Resume> GetByUserIdAndIdAsync(Guid userId, Guid id)
    {
        return await _context.Resumes
            .Include(r => r.AiFeedback)
            .FirstOrDefaultAsync(r => r.ApplicationUserId == userId && r.Id == id);
    }

    public async Task<IEnumerable<Resume>> GetByUserIdAsync(Guid userId)
    {
        return await _context.Resumes
            .Include(r => r.AiFeedback)
            .Where(r => r.ApplicationUserId == userId)
            .ToListAsync();
    }

    public async Task<Resume> UpdateAsync(Resume resume)
    {
        _context.Entry(resume).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return resume;
    }
}
