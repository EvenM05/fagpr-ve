using Fagprove.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Fagprove.Models;
using Fagprove.Models.Dto;
using Microsoft.EntityFrameworkCore;

namespace Fagprove
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class CustomerController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;

        public CustomerController
        (
            AppDbContext appDbContext
        )
        {
            _appDbContext = appDbContext;
        }

        [HttpPost("CreateCustomer")]
        public async Task<IActionResult> CreateCustomer(CreateCustomerDto model)
        {
            if (ModelState.IsValid)
            {
                var customer = new Customer
                {
                    Name = model.Name,
                    ContactMail = model.ContactMail,
                    OrganizationNumber = model.OrganizationNumber,
                };

                await _appDbContext.Customers.AddAsync(customer);
                await _appDbContext.SaveChangesAsync();

                return Ok(model);
            }

            return BadRequest(model);
        }

        [HttpGet("GetCustomerPagination")]
        public async Task<IActionResult> GetCustomerPagination(string searchValue = "", int page = 1, int pageSize = 10)
        {
            IQueryable<Customer> query = _appDbContext.Customers.Where(c => c.Name.ToLower().Contains(searchValue.ToLower()));

            var totalCustomers = await query.CountAsync();
            var customers = await query.Skip((page - 1) * pageSize).Take(pageSize).Select(c => new GetCustomerPaginationData
            {
                Id = c.Id,
                Name = c.Name,
                ContactMail = c.ContactMail,
                OrganizationNumber = c.OrganizationNumber,
            }).ToListAsync();

            var result = new
            {
                items = customers,
                totalItems = totalCustomers,
            };

            return Ok(result);
        }
    }
}