# 🎬 Cinema Management - Docker Documentation

> Complete guide for running Cinema Management system with Docker

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [System Requirements](#-system-requirements)
- [Architecture](#-architecture)
- [Services Overview](#-services-overview)
- [Configuration](#-configuration)
- [Usage Guide](#-usage-guide)
- [Development Workflow](#-development-workflow)
- [Production Deployment](#-production-deployment)
- [Troubleshooting](#-troubleshooting)
- [Performance Optimization](#-performance-optimization)

---

## 🚀 Quick Start

### 1. Install Docker

- **Windows**: [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
- **Mac**: [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
- **Linux**: [Docker Engine](https://docs.docker.com/engine/install/)

### 2. Navigate to Project

```bash
cd d:\Project_A\CinemaManagement
```

### 3. Run Project

```powershell
# Method 1: Using PowerShell script (Recommended for Windows)
.\docker.ps1 up

# Method 2: Using Bash script (Linux/Mac)
chmod +x docker.sh
./docker.sh up

# Method 3: Using docker-compose directly
docker-compose up -d
```

### 4. Access Services

- **Frontend (Next.js)**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health
- **MySQL**: localhost:3306
- **Redis**: localhost:6379

---

## 💻 System Requirements

### Minimum
- **CPU**: 2 cores
- **RAM**: 4GB
- **Disk**: 10GB free space
- **OS**: Windows 10/11, macOS 10.15+, Ubuntu 20.04+

### Recommended
- **CPU**: 4+ cores
- **RAM**: 8GB+
- **Disk**: 20GB+ SSD
- **Network**: Stable internet connection (for MongoDB Atlas & external APIs)

---

## 🏗️ Architecture

### Service Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Docker Network                        │
│                  (cinema_network)                       │
│                                                         │
│  ┌──────────┐    ┌──────────┐     ┌─────────────────┐   │
│  │  Client  │───▶│   API    │───▶│  MySQL + Redis  │   │
│  │ Next.js  │    │  .NET 10 │     │   Databases     │   │
│  │  :3000   │    │  :5000   │     │  :3306 :6379    │   │
│  └──────────┘    └──────────┘     └─────────────────┘   │
│       │               │                    │            │
│       └───────────────┴────────────────────┘            │
└─────────────────────────────────────────────────────────┘
                         │
                    MongoDB Atlas
                    (Cloud Service)
```

### Container Details

| Service | Image | Port | Resources | Dependencies |
|---------|-------|------|-----------|--------------|
| **mysql** | mysql:8.0 | 3306 | 1 CPU, 1GB RAM | - |
| **redis** | redis:7-alpine | 6379 | 0.5 CPU, 512MB | - |
| **api** | Custom (.NET 10) | 5000→8080 | 1 CPU, 1GB RAM | mysql, redis |
| **client** | Custom (Next.js) | 3000 | 0.5 CPU, 512MB | api |

---

## 🔧 Services Overview

### 1. MySQL Database
- **Purpose**: Primary relational database
- **Version**: 8.0
- **Storage**: Persistent volume (`mysql_data`)
- **Health Check**: Every 10s
- **Default Credentials**:
  - User: `root`
  - Password: `luongthanhnhat23`
  - Database: `CinemaDB`

### 2. Redis Cache
- **Purpose**: Caching and session storage
- **Version**: 7 (Alpine)
- **Storage**: Persistent volume (`redis_data`)
- **Health Check**: Every 10s

### 3. Backend API (.NET 10)
- **Framework**: ASP.NET Core 10.0
- **Features**:
  - RESTful API
  - JWT Authentication
  - SignalR for real-time chat
  - Integration with TMDB API
  - Email service (Resend)
  - Gemini AI chatbot
- **Build**: Multi-stage Docker build
- **Health Check**: `/health` endpoint every 30s

### 4. Frontend Client (Next.js)
- **Framework**: Next.js 16 with App Router
- **Features**:
  - Server-Side Rendering (SSR)
  - Static Generation (SSG)
  - TypeScript
  - Tailwind CSS v4
  - React Compiler
- **Build**: Next.js standalone output (~150MB)
- **Health Check**: Root endpoint every 30s

### 5. MongoDB (Cloud)
- **Type**: MongoDB Atlas (Cloud-hosted)
- **Purpose**: NoSQL database for chat sessions
- **Note**: No container needed (external service)

---

## ⚙️ Configuration

### Environment Variables

Create `.env` file from `.env.example`:

```bash
cp .env.example .env
# Edit .env with your values
```

**Default values** (from `.env.example`):
```env
# MySQL
MYSQL_ROOT_PASSWORD=luongthanhnhat23
MYSQL_DATABASE=CinemaDB
MYSQL_PORT=3306

# Redis
REDIS_PORT=6379

# API
API_PORT=5000

# Client
CLIENT_PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:5000

# MongoDB (Optional - defaults to cloud)
# MONGODB_CONNECTION_STRING=mongodb+srv://...
```

**Note**: All values have defaults in `docker-compose.yml`, so `.env` is optional for local development.

### Next.js Environment Variables

Client-side variables must use `NEXT_PUBLIC_` prefix:

```typescript
// ✅ Correct - Available in browser
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// ❌ Wrong - Only available server-side
const apiUrl = process.env.API_URL;
```

### API Configuration Files

- `appsettings.json` - Base configuration
- `appsettings.Docker.json` - Docker-specific overrides
- Environment variables override both files

---

## 📖 Usage Guide

### PowerShell Commands (Windows)

```powershell
# Start all services
.\docker.ps1 up

# View logs (all services)
.\docker.ps1 logs

# View API logs only
.\docker.ps1 logs-api

# View Client logs only
.\docker.ps1 logs-client

# Restart all services
.\docker.ps1 restart

# Restart specific service
.\docker.ps1 restart-api
.\docker.ps1 restart-client

# Stop all services
.\docker.ps1 down

# Rebuild and start
.\docker.ps1 rebuild

# Start only databases
.\docker.ps1 db

# View service status
.\docker.ps1 ps

# Access API container shell
.\docker.ps1 shell-api

# Access MySQL CLI
.\docker.ps1 shell-mysql

# Run database migrations
.\docker.ps1 migrate

# Clean all (⚠️ deletes data)
.\docker.ps1 clean

# Show all commands
.\docker.ps1 help
```

### Docker Compose Commands

```bash
# Start services (detached mode)
docker-compose up -d

# Start with build
docker-compose up -d --build

# Stop services
docker-compose down

# Stop and remove volumes (⚠️ data loss)
docker-compose down -v

# View logs (follow mode)
docker-compose logs -f

# View logs for specific service
docker-compose logs -f api
docker-compose logs -f client

# Restart specific service
docker-compose restart api

# Rebuild specific service
docker-compose build --no-cache api

# View service status
docker-compose ps

# Execute command in container
docker-compose exec api bash
docker-compose exec mysql mysql -u root -p

# Scale services (if stateless)
docker-compose up -d --scale api=3
```

---

## 💼 Development Workflow

### Option 1: Full Docker Stack

Run everything in containers:

```powershell
.\docker.ps1 up
```

**Pros**:
- Consistent environment
- Easy setup
- Mirrors production

**Cons**:
- Slower rebuild times
- Less flexible debugging

### Option 2: Hybrid Development

Run only databases in Docker, code locally:

```powershell
# Terminal 1: Start databases
.\docker.ps1 db

# Terminal 2: Run API locally
cd server\CinemaAPI
dotnet watch run

# Terminal 3: Run Client locally
cd client
npm run dev
```

**Pros**:
- Fast hot-reload
- Full debugging support
- VS Code integration

**Cons**:
- Need local .NET 10 SDK & Node.js
- Manual environment setup

### Database Migrations

```powershell
# In Docker
.\docker.ps1 migrate

# Or manually
docker-compose exec api dotnet ef database update

# Local development
cd server\CinemaAPI
dotnet ef database update
```

### Viewing Logs

```powershell
# Real-time logs for all services
docker-compose logs -f

# Last 100 lines for API
docker-compose logs --tail=100 api

# Logs since 10 minutes ago
docker-compose logs --since 10m

# Logs with timestamps
docker-compose logs -f -t
```

---

## 🚀 Production Deployment

### Pre-deployment Checklist

- [ ] Update `.env` with production values
- [ ] Change default passwords
- [ ] Use environment-specific API keys
- [ ] Enable HTTPS (reverse proxy/load balancer)
- [ ] Set up continuous backups for MySQL
- [ ] Configure log aggregation
- [ ] Set up monitoring (health checks, metrics)
- [ ] Review resource limits in `docker-compose.yml`
- [ ] Test disaster recovery procedures

### Production Environment Variables

For production, update your `.env` file:

```env
# Strong passwords
MYSQL_ROOT_PASSWORD=<strong-random-password>
MYSQL_DATABASE=CinemaDB

# Production ports
MYSQL_PORT=3306
REDIS_PORT=6379
API_PORT=5000
CLIENT_PORT=3000

# Production API URL
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Production MongoDB
MONGODB_CONNECTION_STRING=<production-mongodb-uri>
```

### Production Deployment

Deploy with the same command:

```bash
# Ensure .env has production values
docker-compose up -d --build
```

**Production Best Practices**:
- Use strong, unique passwords
- Enable HTTPS via reverse proxy (nginx, Traefik)
- Set up proper DNS for `NEXT_PUBLIC_API_URL`
- Implement rate limiting
- Configure firewall rules
- Enable automated backups

### Backup & Restore

**MySQL Backup**:
```bash
# Backup
docker-compose exec mysql mysqldump -u root -p CinemaDB > backup_$(date +%Y%m%d).sql

# Restore
docker-compose exec -T mysql mysql -u root -p CinemaDB < backup_20260208.sql
```

**Volume Backup**:
```bash
# Backup volumes
docker run --rm \
  -v cinema_mysql_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/mysql_backup.tar.gz /data
```

---

## 🔍 Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Error**: `bind: address already in use`

**Solution**:
```powershell
# Find process using port
netstat -ano | findstr :3000

# Kill process by PID
taskkill /PID <pid> /F

# Or change port in .env
CLIENT_PORT=3001
```

#### 2. MySQL Connection Failed

**Symptoms**: API logs show "Unable to connect to MySQL"

**Solutions**:
```bash
# Check MySQL is healthy
docker-compose ps

# View MySQL logs
docker-compose logs mysql

# Restart MySQL
docker-compose restart mysql

# Access MySQL to verify
docker-compose exec mysql mysql -u root -p
```

#### 3. Client Build Errors

**Error**: `Module not found` or build failures

**Solutions**:
```bash
# Clear build cache
docker-compose build --no-cache client

# Remove node_modules in container
docker-compose run --rm client rm -rf node_modules .next

# Rebuild
docker-compose up -d --build client
```

#### 4. API Health Check Failing

**Symptoms**: API container constantly restarting

**Solutions**:
```bash
# Check API logs
docker-compose logs api

# Disable health check temporarily (docker-compose.yml)
# Comment out healthcheck section

# Check health endpoint manually
curl http://localhost:5000/health
```

#### 5. Out of Disk Space

**Solutions**:
```powershell
# Remove unused containers
docker system prune

# Remove unused volumes (⚠️ careful!)
docker volume prune

# Remove unused images
docker image prune -a

# View disk usage
docker system df
```

#### 6. Slow Performance

**Causes & Solutions**:

1. **Insufficient Resources**:
   - Increase Docker Desktop memory limit (Settings → Resources)
   - Adjust resource limits in `docker-compose.yml`

2. **Volume Performance** (Windows):
   - Use WSL2 backend
   - Store project in WSL2 filesystem

3. **Network Performance**:
   - Check DNS settings
   - Use `host.docker.internal` for host machine access

### Debug Techniques

```bash
# Enter container shell
docker-compose exec api bash
docker-compose exec client sh

# View container resource usage
docker stats

# Inspect container
docker inspect cinema_api

# View container logs with timestamps
docker-compose logs -f -t api

# Export logs to file
docker-compose logs api > api_logs.txt
```

---

## ⚡ Performance Optimization

### Build Optimization

#### 1. Multi-stage Builds
Both API and Client use multi-stage builds to minimize image size:

- **API**: `sdk` → `build` → `publish` → `final` (~200MB)
- **Client**: `deps` → `builder` → `runner` (~150MB)

#### 2. Layer Caching
Order `Dockerfile` commands for optimal caching:

```dockerfile
# ✅ Good: Dependencies first (cached)
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# ❌ Bad: Everything copied first
COPY . .
RUN npm ci
```

#### 3. .dockerignore
Exclude unnecessary files:

```gitignore
node_modules
.next
.git
*.log
```

### Runtime Optimization

#### 1. Resource Limits
Adjust in `docker-compose.yml`:

```yaml
deploy:
  resources:
    limits:
      cpus: '2.0'
      memory: 2G
    reservations:
      memory: 1G
```

#### 2. Health Checks
Tune intervals based on service criticality:

```yaml
healthcheck:
  interval: 30s      # Check frequency
  timeout: 10s       # Max wait time
  retries: 3         # Attempts before unhealthy
  start_period: 60s  # Grace period on start
```

#### 3. Connection Pooling

Configure in `appsettings.Docker.json`:

```json
{
  "ConnectionStrings": {
    "CinemaDatabase": "Server=mysql;...;Pooling=true;MinPoolSize=5;MaxPoolSize=100;"
  }
}
```

### Next.js Specific

#### Standalone Output
Already configured in `next.config.ts`:

```typescript
export default {
  output: 'standalone',  // Reduces size by ~85%
}
```

#### Image Optimization
Use Next.js Image component:

```tsx
import Image from 'next/image'

<Image src="/poster.jpg" width={300} height={450} />
```

---

## 📚 Additional Resources

### Documentation
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Next.js Docker Deployment](https://nextjs.org/docs/deployment#docker-image)
- [.NET Docker Guide](https://docs.microsoft.com/en-us/dotnet/core/docker/introduction)

### Tools
- **Docker Desktop**: GUI for managing containers
- **Portainer**: Web-based Docker management UI
- **Lazydocker**: Terminal UI for Docker

### Best Practices
1. Use environment variables for configuration
2. Never commit secrets to version control
3. Implement proper health checks
4. Set appropriate resource limits
5. Use volumes for persistent data
6. Tag images with versions
7. Monitor resource usage
8. Regular security updates
9. Implement backup strategies
10. Document all customizations

---

## 📝 Notes

### Important Points

- **MongoDB**: Uses cloud-hosted MongoDB Atlas (no container needed)
- **Next.js**: Standalone output mode reduces Docker image size by ~85%
- **API Keys**: Currently hardcoded - move to environment variables for production
- **Volumes**: Data persists in Docker volumes even after `docker-compose down`
- **Networking**: All services communicate via `cinema_network` bridge
- **Health Checks**: Services wait for dependencies before starting

### Security Reminders

⚠️ **Before deploying to production**:

1. Change all default passwords
2. Move API keys to environment variables or secrets management
3. Enable HTTPS/TLS
4. Implement rate limiting
5. Set up firewall rules
6. Regular security updates
7. Backup encryption
8. Audit logging

---

## 🤝 Support

For issues or questions:

1. Check [Troubleshooting](#-troubleshooting) section
2. Review Docker logs: `docker-compose logs`
3. Verify environment variables in `.env`
4. Check service health: `docker-compose ps`

---

**Last Updated**: February 8, 2026  
**Docker Compose Version**: 3.8  
**Tested On**: Windows 11, Docker Desktop 4.x