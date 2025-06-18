using Fagprove.Data;
using Fagprove.Models.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Fagprove.Models;
using Microsoft.EntityFrameworkCore;
using Fagprove.Utils.Enums;
using Microsoft.Extensions.ObjectPool;
using System.Globalization;

namespace Fagprove.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

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

        [HttpPut("UpdateProject")]
        public async Task<IActionResult> UpdateProject(Guid id, UpdateProjectDto model)
        {
            if (ModelState.IsValid)
            {
                var project = await _appDbContext.Project.FindAsync(id);

                if (model.Name != null)
                {
                    project.Name = model.Name;
                }
                if (model.Description != null)
                {
                    project.Description = model.Description;
                }
                if (model.Status != null)
                {
                    project.Status = model.Status;
                }

                project.UpdatedUserId = model.UpdatedUserId;

                await _appDbContext.SaveChangesAsync();
                return Ok(project);
            }

            return BadRequest(model);
        }

        [HttpPut("UpdateProjectCustomer")]
        public async Task<IActionResult> UpdateProjectCustomer(Guid id, AddCustomerDto model)
        {
            if (ModelState.IsValid)
            {
                var project = await _appDbContext.Project.FindAsync(id);

                project.CustomerId = model.CustomerId;
                project.UpdatedUserId = model.UpdatedUserId;
                project.UpdatedDate = DateTime.UtcNow;

                await _appDbContext.SaveChangesAsync();
                return Ok(project);
            }
            return BadRequest(model);
        }

        [HttpGet("GetProjectById")]
        public async Task<IActionResult> GetProjectById(Guid id)
        {
            var project = await _appDbContext.Project.Where(p => p.Id == id).Select(p => new ProjectPaginationDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Status = p.Status,
                CreatedDate = p.CreatedDate,
                UpdatedDate = p.UpdatedDate,
                CreatedUser = new GetUserByIdDto
                {
                    Id = p.CreatedUser.Id,
                    Name = p.CreatedUser.Name,
                    Email = p.CreatedUser.Email,
                    RoleId = p.CreatedUser.RoleId,
                },
                UpdatedUser = new GetUserByIdDto
                {
                    Id = p.UpdatedUser.Id,
                    Name = p.UpdatedUser.Name,
                    Email = p.UpdatedUser.Email,
                    RoleId = p.UpdatedUser.RoleId,
                },
                Customer = p.Customer,
                Resources = p.Resources,
            }).FirstOrDefaultAsync();

            return Ok(project);   
        }

        [HttpGet("GetProjectPagination")]
        public async Task<IActionResult> GetProjectPagination([FromQuery] string searchValue = "", int page = 1, int pageSize = 10, string sortOrder = "desc", StatusEnum? statusFilter = null)
        {
            IQueryable<Project> query = _appDbContext.Project.Where(p => p.Name.ToLower().Contains(searchValue.ToLower()));

            if (statusFilter != null)
            {
                query = query.Where(c => c.Status == (StatusEnum)statusFilter);
            }

            if (sortOrder == "asc")
            {
                query = query.OrderBy(c => c.UpdatedDate);
            }
            else if (sortOrder == "desc")
            {
                query = query.OrderByDescending(c => c.UpdatedDate);
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
                CreatedUser = new GetUserByIdDto
                {
                    Id = p.CreatedUser.Id,
                    Name = p.CreatedUser.Name,
                    Email = p.CreatedUser.Email,
                    RoleId = p.CreatedUser.RoleId,
                },
                UpdatedUser = new GetUserByIdDto
                {
                    Id = p.UpdatedUser.Id,
                    Name = p.UpdatedUser.Name,
                    Email = p.UpdatedUser.Email,
                    RoleId = p.UpdatedUser.RoleId,
                },
                Customer = p.Customer,
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
                totalProjects = await _appDbContext.Project.CountAsync(),
                toDoProjects,
                startedProjects,
                completedProjects,
                cancelledProjects,
            };

            return Ok(result);
        }

        [HttpGet("GetProjectMonthlyData")]
        public async Task<IActionResult> GetProjectMonthlyData()
        {
        var projects = _appDbContext.Project
            .Where(p => p.CreatedDate.Year == 2025)
            .Select(p => new
            {
                Month = p.CreatedDate.Month,
                Budget = p.Resources.Sum(r => r.TotalCost),
            })
            .ToList();

        var grouped = projects
            .GroupBy(p => p.Month)
            .Select(g => new ProjectMonthlyDataModel
            {
                month = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(g.Key),
                projectCount = g.Count(),
                projectBudget = g.Sum(x => x.Budget)
            })
            .OrderBy(x => DateTime.ParseExact(x.month, "MMMM", CultureInfo.CurrentCulture))
            .ToList();

        return Ok(grouped);
        }
    }
}