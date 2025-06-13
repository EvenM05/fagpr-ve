using Fagprove.Data;
using Fagprove.Models.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Fagprove.Models;
using Microsoft.EntityFrameworkCore;
using Fagprove.Utils.Enums;

namespace Farprove.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize]

    public class ProjectController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;

        public ProjectController
        (
            AppDbContext appDbContext
        )
        {
            _appDbContext = appDbContext;
        }

        [HttpPost("CreateProject")]
        public async Task<IActionResult> CreateProject(CreateProjectDto model)
        {
            if (ModelState.IsValid)
            {
                var project = new Project
                {
                    Name = model.Name,
                    Description = model.Description,
                    Status = 0,
                    CreatedDate = DateTime.UtcNow,
                    UpdatedDate = DateTime.UtcNow,
                    CreatedUserId = model.CreatedUserId,
                    UpdatedUserId = model.CreatedUserId,
                };

                await _appDbContext.Project.AddAsync(project);
                await _appDbContext.SaveChangesAsync();

                return Ok(project);
            }
            return BadRequest(model);
        }



        [HttpPut("UpdateProjectStatus")]
        public async Task<IActionResult> UpdateProjectStatus(Guid id, StatusUpdateDto model)
        {
            if (ModelState.IsValid)
            {
                var project = await _appDbContext.Project.FindAsync(id);

                project.Status = model.statusEnum;
                project.UpdatedUserId = model.UpdatedUserId;
                project.UpdatedDate = DateTime.UtcNow;

                await _appDbContext.SaveChangesAsync();

                return Ok(project);
            }
            return BadRequest(model);
        }

        [HttpGet("GetProjects")]
        public async Task<IActionResult> GetProjectPagination([FromQuery] string searchValue = "", int page = 1, int pageSize = 10, string sortOrder = "desc", int statusFilter = 0)
        {
            IQueryable<Project> query = _appDbContext.Project.Where(p => p.Name.ToLower().Contains(searchValue.ToLower()));

            if (statusFilter != 0)
            {
                query = query.Where(c => c.Status == (StatusEnum)statusFilter);
            }

            if (sortOrder == "asc")
            {
                query = query.OrderBy(c => c.CreatedDate);
            }
            else if (sortOrder == "desc")
            {
                query = query.OrderByDescending(c => c.CreatedDate);
            }
            else
            {
                return BadRequest("Invalid sortOrder parameter. Use 'asc' or 'desc'.");
            }

            var totalProjects = await query.CountAsync();
            var projects = await query.Skip((page - 1) * pageSize).Take(pageSize).Select(p => new ProjectPaginationDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Status = p.Status,
                CreatedDate = p.CreatedDate,
                UpdatedDate = p.UpdatedDate,
                CreatedUser = p.CreatedUser,
                UpdatedUser = p.UpdatedUser,
                Resources = p.Resources

            }).ToListAsync();

            var result = new
            {
                items = projects,
                totalItems = totalProjects
            };

            return Ok(result);
        }

        [HttpGet("GetProjectStatusList")]
        public async Task<IActionResult> GetProjectStatusList()
        {
            var toDoProjects = await _appDbContext.Project.Where(p => p.Status == StatusEnum.ToDo).CountAsync();
            var startedProjects = await _appDbContext.Project.Where(p => p.Status == StatusEnum.InProgress).CountAsync();
            var completedProjects = await _appDbContext.Project.Where(p => p.Status == StatusEnum.Completed).CountAsync();
            var cancelledProjects = await _appDbContext.Project.Where(p => p.Status == StatusEnum.Cancelled).CountAsync();

            var result = new
            {
                toDoProjects,
                startedProjects,
                completedProjects,
                cancelledProjects,
            };

            return Ok(result);
        }
    }
}