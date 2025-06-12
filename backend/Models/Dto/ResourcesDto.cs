using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Versioning;
using Fagprove.Utils.Enums;

namespace Fagprove.Models.Dto
{

    public class CreateResourceDto
    {
        public EstimateEnum EstimateType { get; set; }
        public int TimeHours { get; set; }
        public int TimeCost { get; set; }
        public Guid ProjectId { get; set; }
    }
}