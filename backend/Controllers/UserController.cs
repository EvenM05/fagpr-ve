using Fagprove.Data;
using Fagprove.Models;
using Fagprove.Models.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Fagprove.Utils.Enums;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Fagprove.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

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
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto model)
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

                await _appDbContext.User.AddAsync(user);
                await _appDbContext.SaveChangesAsync();

                return Ok(user);
            }
            return BadRequest(model);
        }

        [HttpPut("UpdateUserData")]
        public async Task<IActionResult> UpdateUserData(Guid userId, UpdateUserDto updateModel)
        {
            if (ModelState.IsValid)
            {
                var user = await _appDbContext.User.FindAsync(userId);

                if (updateModel.name != null)
                {
                    user.Name = updateModel.name;
                }

                if (updateModel.newPassword != null)
                {
                    var salt = BCrypt.Net.BCrypt.GenerateSalt();
                    var hashedPassword = BCrypt.Net.BCrypt.HashPassword(updateModel.newPassword, salt);
                    user.PasswordHash = hashedPassword;
                }

                if (updateModel.RoleId != null)
                {
                    user.RoleId = updateModel.RoleId;
                }

                await _appDbContext.SaveChangesAsync();
                return Ok(user);
            }
            return BadRequest(updateModel);
        }

        [HttpGet("GetAllUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _appDbContext.User.Select(u => new GetUserByIdDto
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                RoleId = u.RoleId,
            }).ToListAsync();

            return Ok(users);
        }

        [HttpGet("GetUserById")]
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

        [HttpDelete("DeleteUser")]
        public async Task<IActionResult> DeleteUser(Guid userId)
        {
            var user = await _appDbContext.User.FindAsync(userId);

            if (user == null)
            {
                return NotFound(userId);
            }

            _appDbContext.User.Remove(user);
            await _appDbContext.SaveChangesAsync();

            return Ok(userId);
        }
    }
}