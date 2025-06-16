using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Versioning;
using Fagprove.Utils.Enums;

namespace Fagprove.Models.Dto
{
    public class CreateProjectDto
    {

        public string Name { get; set; }
        public string Description { get; set; }
        public Guid CreatedUserId { get; set; }

    }

    public class ProjectPaginationDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public StatusEnum Status { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }

        public User CreatedUser { get; set; }
        public User UpdatedUser { get; set; }

        public ICollection<Resources>? Resources { get; set; }
    }

    public class StatusUpdateDto
    {
        public StatusEnum status { get; set; }
        public Guid UpdatedUserId { get; set; }
    }

    public class ProjectMonthlyDataModel
    {
        public string month { get; set; }
        public int projectCount { get; set; }
        public int projectBudget { get; set; }
    }
    
}