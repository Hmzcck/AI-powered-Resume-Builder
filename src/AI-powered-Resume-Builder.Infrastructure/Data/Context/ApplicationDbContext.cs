using AI_powered_Resume_Builder.Domain.AiFeedbacks;
using AI_powered_Resume_Builder.Domain.Resumes;
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

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Ignore<IdentityUserLogin<Guid>>();
            builder.Ignore<IdentityUserToken<Guid>>();
            builder.Ignore<IdentityUserClaim<Guid>>();
            builder.Ignore<IdentityRoleClaim<Guid>>();
            builder.Ignore<IdentityUserRole<Guid>>();
            builder.Ignore<IdentityRole<Guid>>();


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
        }
    }