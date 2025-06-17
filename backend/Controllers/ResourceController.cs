using Fagprove.Data;
using Fagprove.Models;
using Fagprove.Models.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Farprove.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class ResourceController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;

        public ResourceController
        (
            AppDbContext appDbContext
        )
        {
            _appDbContext = appDbContext;
        }

        [HttpPost("CreateResource")]
        public async Task<IActionResult> CreateResource(CreateResourceDto model)
        {
            if (ModelState.IsValid)
            {
                var resource = new Resources
                {
                    EstimateType = model.EstimateType,
                    TimeHours = model.TimeHours,
                    TimeCost = model.TimeCost,
                    ProjectId = model.ProjectId,
                    TotalCost = model.TimeCost * model.TimeHours,
                };

                await _appDbContext.Resources.AddAsync(resource);
                await _appDbContext.SaveChangesAsync();

                return Ok(resource);

            }

            return BadRequest(model);
        }

        [HttpGet("GetAllResources")]
        public async Task<IActionResult> GetAllResources()
        {
            var resources = await _appDbContext.Resources.ToListAsync();

            return Ok(resources);
        }

        [HttpGet("GetResourceByProject")]
        public async Task<IActionResult> GetResourceByProject(Guid projectId)
        {
            var resources = await _appDbContext.Resources.Where(r => r.ProjectId == projectId).ToListAsync();

            return Ok(resources);
        }
    }
}