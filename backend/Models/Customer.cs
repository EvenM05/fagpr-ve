using System.ComponentModel.DataAnnotations;

namespace Fagprove.Models
{
    public class Customer
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public string Name { get; set; }

        public string ContactMail { get; set; }
    
        public int OrganizationNumber { get; set; }
    }   
}