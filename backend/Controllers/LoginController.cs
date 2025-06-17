using Fagprove.Data;
using Fagprove.Models;
using Fagprove.Models.Dto;
using Fagprove.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Fagprove.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class LoginController : ControllerBase
    { 
        private readonly AppDbContext _appDbContext;
    
        public LoginController
        (
            AppDbContext appDbContext
        )
        {
            _appDbContext = appDbContext;
        }
        
        private bool VerifyPassword(string password, string passwordHash, string salt)
        {
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password, salt);
            return hashedPassword == passwordHash;
        }


        [HttpPost("LoginUser")]
        public async Task<IActionResult> LoginUser(LoginDto model)
        {
            var user = await _appDbContext.User.Where(u => u.Email == model.Email).FirstOrDefaultAsync();

            if (user == null)
            {
                return BadRequest( new { Error = "No user with the specified email"});
            }

            if ( !VerifyPassword(model.Password, user.PasswordHash, user.Salt)) 
            {
                return Unauthorized(new {Error = "Unauthorized"});
            }

            var token = JwtTokenManager.GenerateJwtToken(user.Id);

            var returnData = new
            {
                token = token,
            };

            return Ok(returnData);
        }
        
    }
}