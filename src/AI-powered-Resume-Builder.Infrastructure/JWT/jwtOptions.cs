using System;

namespace AI_powered_Resume_Builder.Infrastructure.JWT;

 public class JwtOptions
    {
        public string Issuer { get; set; } = default!;
        public string Audience { get; set; } = default!;
        public string SigningKey { get; set; } = default!;
    }