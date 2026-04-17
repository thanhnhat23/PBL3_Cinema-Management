using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection;
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

		public virtual async Task SoftDeleteAsync(T entity, Guid? deletedBy = null)
		{
			var deletedAtProperty = typeof(T).GetProperty("deleted_at", BindingFlags.Public | BindingFlags.Instance);
			var deletedByProperty = typeof(T).GetProperty("deleted_by", BindingFlags.Public | BindingFlags.Instance);
			
			if (deletedAtProperty == null || !deletedAtProperty.CanWrite)
			{
				throw new InvalidOperationException($"Type {typeof(T).Name} does not support soft delete.");
			}

			if (deletedAtProperty.PropertyType == typeof(DateTime?))
			{
				deletedAtProperty.SetValue(entity, DateTime.UtcNow);
			}
			else if (deletedAtProperty.PropertyType == typeof(DateTime))
			{
				deletedAtProperty.SetValue(entity, DateTime.UtcNow);
			}
			else
			{
				throw new InvalidOperationException($"Type {typeof(T).Name} uses unsupported deleted_at type.");
			}

			if (deletedByProperty != null && deletedByProperty.CanWrite)
			{
				if (deletedByProperty.PropertyType == typeof(Guid?))
				{
					deletedByProperty.SetValue(entity, deletedBy);
				}
				else if (deletedByProperty.PropertyType == typeof(Guid))
				{
					if (!deletedBy.HasValue)
					{
						throw new InvalidOperationException($"Type {typeof(T).Name} requires deleted_by but no value was provided.");
					}

					deletedByProperty.SetValue(entity, deletedBy.Value);
				}
				else
				{
					throw new InvalidOperationException($"Type {typeof(T).Name} uses unsupported deleted_by type.");
				}
			}

			_dbContext.Set<T>().Update(entity);
			await _dbContext.SaveChangesAsync();
		}

		public virtual async Task HardDeleteAsync(T entity)
		{
			_dbContext.Set<T>().Remove(entity);
			await _dbContext.SaveChangesAsync();
		}
	}
}