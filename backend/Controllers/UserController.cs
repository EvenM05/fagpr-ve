using Fagprove.Data;
using Fagprove.Models;
using Fagprove.Models.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Fagprove.Utils.Enums;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Security.Claims;

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
        [AllowAnonymous]
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

                if (updateModel.newPassword != "")
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

            [HttpGet("GetAuthenticatedUser")]
            public async Task<IActionResult> GetAuthenticatedUser()
            {
                var userIdClaim = HttpContext.User.Claims
                    .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);

                if (userIdClaim == null)
                {
                    return Unauthorized("User ID claim not found.");
                }

                Console.WriteLine(userIdClaim.Value);

                if (!Guid.TryParse(userIdClaim.Value, out var userId))
                {
                    return BadRequest("Invalid user ID format in token.");
                }

                var user = await _appDbContext.User
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                {
                    return NotFound("User not found.");
                }

                var result = new
                {
                    user.Id,
                    user.Email,
                    user.Name,
                    user.RoleId
                };

                return Ok(result);
            }


        [HttpGet("GetUserPagination")]
        public async Task<IActionResult> GetUserPagination([FromQuery] string searchValue = "", int page = 1, int pageSize = 10, RoleEnum? roleFilter = null)
        {
            IQueryable<User> query = _appDbContext.User.Where(u => u.Name.ToLower().Contains(searchValue.ToLower()));

            Console.WriteLine(roleFilter);

            if (roleFilter != null)
            {
                query = query.Where(u => u.RoleId == roleFilter);
            }

            var totalUsers = await query.CountAsync();
            var users = await query.Skip((page - 1) * pageSize).Take(pageSize).Select(u => new GetUserByIdDto
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                RoleId = u.RoleId
            }).ToListAsync();

            var result = new
            {
                items = users,
                totalItems = totalUsers,
            };

            return Ok(result);
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

        [HttpGet("GetUserRoleData")]
        public async Task<IActionResult> GetUserRoleData()
        {
            var result = new
            {
                total = await _appDbContext.User.CountAsync(),
                regularUser = await _appDbContext.User.Where(u => u.RoleId == RoleEnum.User).CountAsync(),
                pmUser = await _appDbContext.User.Where(u => u.RoleId == RoleEnum.ProjectManager).CountAsync(),
                adminUser = await _appDbContext.User.Where(u => u.RoleId == RoleEnum.Admin).CountAsync()
            };
            return Ok(result);
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