using Fagprove.Utils.Enums;

namespace Fagprove.Models.Dto
{
    public class CreateUserDto
    {
        public string? Name { get; set; }

        public string? Email { get; set; }

        public string? Password { get; set; }

        public RoleEnum? RoleId { get; set; }
    }

    public class GetUserByIdDto
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public RoleEnum? RoleId { get; set; }
    }
}