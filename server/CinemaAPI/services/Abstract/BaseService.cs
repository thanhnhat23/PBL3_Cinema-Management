using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CinemaAPI.Services.Abstract
{
	public abstract class BaseService<T> where T : class
	{
		protected readonly DbContext _dbContext;

		protected BaseService(DbContext dbContext)
		{
			_dbContext = dbContext;
		}

		public virtual async Task<List<T>> GetAllAsync()
		{
			return await _dbContext.Set<T>().ToListAsync();
		}

		public virtual async Task<T?> GetByIdAsync(object id)
		{
			return await _dbContext.Set<T>().FindAsync(id);
		}

		public virtual async Task AddAsync(T entity)
		{
			await _dbContext.Set<T>().AddAsync(entity);
			await _dbContext.SaveChangesAsync();
		}

		public virtual async Task UpdateAsync(T entity)
		{
			_dbContext.Set<T>().Update(entity);
			await _dbContext.SaveChangesAsync();
		}

		public virtual async Task DeleteAsync(object id)
		{
			var entity = await GetByIdAsync(id);
			if (entity != null)
			{
				_dbContext.Set<T>().Remove(entity);
				await _dbContext.SaveChangesAsync();
			}
		}
	}
}