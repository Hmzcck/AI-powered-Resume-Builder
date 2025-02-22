using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AI_powered_Resume_Builder.Domain.Common;

public abstract class BaseEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}