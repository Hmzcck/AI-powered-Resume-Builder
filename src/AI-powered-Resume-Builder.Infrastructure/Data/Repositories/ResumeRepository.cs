using AI_powered_Resume_Builder.Domain.Resumes;
using AI_powered_Resume_Builder.Domain.Resumes.Sections;
using AI_powered_Resume_Builder.Infrastructure.Data.Context;
using Microsoft.EntityFrameworkCore;

namespace AI_powered_Resume_Builder.Infrastructure.Data.Repositories;

public class ResumeRepository(ApplicationDbContext _context) : IResumeRepository
{
    private IQueryable<Resume> IncludeAllSections(IQueryable<Resume> query)
    {
        return query
            .Include(r => r.AiFeedback)
            .Include(r => r.Summary)
            .Include(r => r.Experiences)
            .Include(r => r.Education)
            .Include(r => r.Skills)
            .Include(r => r.Projects)
            .Include(r => r.Certifications)
            .Include(r => r.Languages)
            .Include(r => r.Awards)
            .Include(r => r.Publications)
            .Include(r => r.References);
    }

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
        return await IncludeAllSections(_context.Resumes).ToListAsync();
    }

    public async Task<Resume> GetByIdAsync(Guid id)
    {
        return await IncludeAllSections(_context.Resumes)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<Resume> GetByUserIdAndIdAsync(Guid userId, Guid id)
    {
        return await IncludeAllSections(_context.Resumes)
            .FirstOrDefaultAsync(r => r.ApplicationUserId == userId && r.Id == id);
    }

    public async Task<IEnumerable<Resume>> GetByUserIdAsync(Guid userId)
    {
        return await IncludeAllSections(_context.Resumes)
            .Where(r => r.ApplicationUserId == userId)
            .ToListAsync();
    }

    public async Task<Resume> UpdateAsync(Resume resume)
    {
        // Handle section updates
        _context.Entry(resume).State = EntityState.Modified;
        
        if (resume.Summary != null)
        {
            _context.Entry(resume.Summary).State = resume.Summary.Id == Guid.Empty ? 
                EntityState.Added : EntityState.Modified;
        }

        foreach (var section in resume.Experiences) UpdateSection(section);
        foreach (var section in resume.Education) UpdateSection(section);
        foreach (var section in resume.Skills) UpdateSection(section);
        foreach (var section in resume.Projects) UpdateSection(section);
        foreach (var section in resume.Certifications) UpdateSection(section);
        foreach (var section in resume.Languages) UpdateSection(section);
        foreach (var section in resume.Awards) UpdateSection(section);
        foreach (var section in resume.Publications) UpdateSection(section);
        foreach (var section in resume.References) UpdateSection(section);

        await _context.SaveChangesAsync();
        return resume;
    }

    private void UpdateSection<T>(T section) where T : ResumeSection
    {
        _context.Entry(section).State = section.Id == Guid.Empty ? 
            EntityState.Added : EntityState.Modified;
    }

    // Helper methods for managing individual sections
    public async Task<T> AddSectionAsync<T>(T section) where T : ResumeSection
    {
        await _context.Set<T>().AddAsync(section);
        await _context.SaveChangesAsync();
        return section;
    }

    public async Task<T> UpdateSectionAsync<T>(T section) where T : ResumeSection
    {
        _context.Entry(section).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return section;
    }

    public async Task DeleteSectionAsync<T>(Guid sectionId) where T : ResumeSection
    {
        var section = await _context.Set<T>().FindAsync(sectionId);
        if (section != null)
        {
            _context.Set<T>().Remove(section);
            await _context.SaveChangesAsync();
        }
    }
}
