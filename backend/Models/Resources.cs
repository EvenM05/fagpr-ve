using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Fagprove.Utils.Enums;

namespace Fagprove.Models
{
    public class Resources
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public EstimateEnum EstimateType { get; set; }

        public int TimeHours { get; set; }

        public int TimeCost { get; set; }

        public int TotalCost { get; set; }
        
        public Guid ProjectId { get; set; }
        
        [ForeignKey("ProjectId")]
        public Project? Project { get; set; } = null!;
    }
}