using Fagprove.Data;
using Fagprove.Models;
using Fagprove.Models.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Fagprove.Utils.Enums;

namespace Fagprove.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class UserController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;

        public UserController
        (
            AppDbContext appDbContext
        )
        {
            _appDbContext = appDbContext;
        }

        [HttpPost("CreateUser")]
        public IActionResult CreateUser([FromBody] CreateUserDto model)
        {
            if (ModelState.IsValid)
            {
                if (_appDbContext.User.Any(u => u.Email == model.Email))
                {
                    return BadRequest(new { Error = "User with provided email already exists" });
                }

                var salt = BCrypt.Net.BCrypt.GenerateSalt();
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password, salt);

                var user = new User
                {
                    Name = model.Name,
                    Email = model.Email,
                    PasswordHash = hashedPassword,
                    Salt = salt,
                    RoleId = model.RoleId
                };

                _appDbContext.User.Add(user);
                _appDbContext.SaveChanges();

                return Ok(user);
            }
            return BadRequest(model);
        }

        [HttpGet("GetUserById")]
        [Authorize]
        public async Task<IActionResult> GetUserById(Guid id)
        {
            var user = await _appDbContext.User.Where(u => u.Id == id).Select(u => new GetUserByIdDto
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                RoleId = u.RoleId
            }).FirstOrDefaultAsync();

            return Ok(user);
        }
    }
}