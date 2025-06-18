namespace Fagprove.Models.Dto
{
    public class CreateCustomerDto
    {
        public string Name { get; set; }

        public string ContactMail { get; set; }

        public int OrganizationNumber { get; set; }
    }


    public class GetCustomerPaginationData
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string ContactMail { get; set; }

        public int OrganizationNumber { get; set; }
    }
}