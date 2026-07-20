using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FooterController : ControllerBase
{
    private readonly AppDbContext _db;
    public FooterController(AppDbContext db) { _db = db; }

    // Public — used by the public site's footer component on every page.
    // Returns only active items, ordered for display.
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var items = await _db.FooterContents
            .Where(f => f.IsActive)
            .OrderBy(f => f.Section).ThenBy(f => f.SortOrder)
            .Select(f => new FooterContentDto
            {
                Id = f.Id,
                Section = f.Section,
                Label = f.Label,
                Url = f.Url,
                Icon = f.Icon,
                SortOrder = f.SortOrder,
                IsActive = f.IsActive
            })
            .ToListAsync();
        return Ok(items);
    }

    // Admin-only — list everything (including hidden rows) for the admin UI.
    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllAdmin()
    {
        var items = await _db.FooterContents
            .OrderBy(f => f.Section).ThenBy(f => f.SortOrder)
            .Select(f => new FooterContentDto
            {
                Id = f.Id,
                Section = f.Section,
                Label = f.Label,
                Url = f.Url,
                Icon = f.Icon,
                SortOrder = f.SortOrder,
                IsActive = f.IsActive
            })
            .ToListAsync();
        return Ok(items);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] FooterContentCreateUpdateDto dto)
    {
        var item = new FooterContent
        {
            Section = dto.Section,
            Label = dto.Label,
            Url = dto.Url,
            Icon = dto.Icon,
            SortOrder = dto.SortOrder,
            IsActive = dto.IsActive
        };
        _db.FooterContents.Add(item);
        await _db.SaveChangesAsync();
        return Ok(new { item.Id });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] FooterContentCreateUpdateDto dto)
    {
        var item = await _db.FooterContents.FindAsync(id);
        if (item == null) return NotFound();

        item.Section = dto.Section;
        item.Label = dto.Label;
        item.Url = dto.Url;
        item.Icon = dto.Icon;
        item.SortOrder = dto.SortOrder;
        item.IsActive = dto.IsActive;
        await _db.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await _db.FooterContents.FindAsync(id);
        if (item == null) return NotFound();
        _db.FooterContents.Remove(item);
        await _db.SaveChangesAsync();
        return Ok();
    }
}