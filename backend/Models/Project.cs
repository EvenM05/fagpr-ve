using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Versioning;
using Fagprove.Utils.Enums;

namespace Fagprove.Models
{
    public class Project
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public string Name { get; set; }

        public string Description { get; set; }

        public StatusEnum Status { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }

        public User CreatedUser { get; set; }
        public User UpdatedUser { get; set; }

        public ICollection<ResourceScope>? Resources { get; set; }
    }
}