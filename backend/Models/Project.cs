using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
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


        public Guid CreatedUserId { get; set; }

        [ForeignKey("CreatedUserId")]
        public User? CreatedUser { get; set; }

        public Guid UpdatedUserId { get; set; }

        [ForeignKey("UpdatedUserId")]
        public User? UpdatedUser { get; set; }

        public ICollection<Resources>? Resources { get; set; }

        public Guid? CustomerId { get; set; }

        [ForeignKey("CustomerId")]
        public Customer? Customer { get; set; }
    }
}