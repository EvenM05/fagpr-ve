using System.ComponentModel.DataAnnotations;
using Fagprove.Utils.Enums;

namespace Fagprove.Models
{
    public class User
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [StringLength(250)]
        public string? Name { get; set; }

        [StringLength(250)]
        public string? Email { get; set; }

        [StringLength(100)]
        public string? PasswordHash { get; set; }

        [StringLength(50)]
        public string? Salt { get; set; }

        public RoleEnum? RoleId { get; set; }
        
    }
}