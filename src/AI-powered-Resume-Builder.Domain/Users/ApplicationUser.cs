using System;
using AI_powered_Resume_Builder.Domain.Resumes;
using Microsoft.AspNetCore.Identity;

namespace AI_powered_Resume_Builder.Domain.Users;

public class ApplicationUser : IdentityUser<Guid>
{
    public ICollection<Resume> Resumes { get; set; } = new List<Resume>();
}