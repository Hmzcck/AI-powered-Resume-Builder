using AI_powered_Resume_Builder.Domain.AiFeedbacks;
using AI_powered_Resume_Builder.Domain.Resumes;
using AI_powered_Resume_Builder.Domain.Resumes.Sections;
using AI_powered_Resume_Builder.Domain.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AI_powered_Resume_Builder.Infrastructure.Data.Context;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<Resume> Resumes { get; set; }
    public DbSet<AiFeedback> AIFeedbacks { get; set; }
    public DbSet<ApplicationUser> ApplicationUsers { get; set; }

    // Resume Sections
    public DbSet<Summary> Summaries { get; set; }
    public DbSet<Experience> Experiences { get; set; }
    public DbSet<Education> Education { get; set; }
    public DbSet<Skill> Skills { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<Certification> Certifications { get; set; }
    public DbSet<Language> Languages { get; set; }
    public DbSet<Award> Awards { get; set; }
    public DbSet<Publication> Publications { get; set; }
    public DbSet<Reference> References { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Ignore<IdentityUserLogin<Guid>>();
        builder.Ignore<IdentityUserToken<Guid>>();
        builder.Ignore<IdentityUserClaim<Guid>>();
        builder.Ignore<IdentityRoleClaim<Guid>>();
        builder.Ignore<IdentityUserRole<Guid>>();
        builder.Ignore<IdentityRole<Guid>>();

        // Configure Resume relationships
        builder.Entity<Resume>()
            .HasOne(r => r.AiFeedback)
            .WithOne(af => af.Resume)
            .HasForeignKey<AiFeedback>(af => af.ResumeId)
            .IsRequired(false);

        builder.Entity<Resume>()
            .HasOne(r => r.ApplicationUser)
            .WithMany(au => au.Resumes)
            .HasForeignKey(r => r.ApplicationUserId)
            .IsRequired(true);

        // Configure Resume sections relationships
        
        // One-to-One relationship for Summary
        builder.Entity<Resume>()
            .HasOne(r => r.Summary)
            .WithOne()
            .HasForeignKey<Summary>(s => s.ResumeId)
            .OnDelete(DeleteBehavior.Cascade);

        // One-to-Many relationships for other sections
        builder.Entity<Resume>()
            .HasMany(r => r.Experiences)
            .WithOne(e => e.Resume)
            .HasForeignKey(e => e.ResumeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Resume>()
            .HasMany(r => r.Education)
            .WithOne(e => e.Resume)
            .HasForeignKey(e => e.ResumeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Resume>()
            .HasMany(r => r.Skills)
            .WithOne(s => s.Resume)
            .HasForeignKey(s => s.ResumeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Resume>()
            .HasMany(r => r.Projects)
            .WithOne(p => p.Resume)
            .HasForeignKey(p => p.ResumeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Resume>()
            .HasMany(r => r.Certifications)
            .WithOne(c => c.Resume)
            .HasForeignKey(c => c.ResumeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Resume>()
            .HasMany(r => r.Languages)
            .WithOne(l => l.Resume)
            .HasForeignKey(l => l.ResumeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Resume>()
            .HasMany(r => r.Awards)
            .WithOne(a => a.Resume)
            .HasForeignKey(a => a.ResumeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Resume>()
            .HasMany(r => r.Publications)
            .WithOne(p => p.Resume)
            .HasForeignKey(p => p.ResumeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Resume>()
            .HasMany(r => r.References)
            .WithOne(r => r.Resume)
            .HasForeignKey(r => r.ResumeId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure common properties for all sections
        builder.Entity<ResumeSection>().UseTpcMappingStrategy();
    }
}
