# 🎬 Cinema Management System

## 🚀 Quick Start

### Using Docker (Recommended)

```powershell
# Start all services
.\docker.ps1 up

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

👉 **[Complete Docker Documentation](README.Docker.md)**

### Local Development

```bash
# Start databases only
.\docker.ps1 db

# Terminal 1: Run API
cd server/CinemaAPI
dotnet run

# Terminal 2: Run Client
cd client
npm run dev
```

## 🏗️ Tech Stack

### Backend
- **Framework**: .NET 10.0 (ASP.NET Core)
- **Database**: MySQL 8.0
- **Cache**: Redis 7
- **NoSQL**: MongoDB Atlas (Cloud)
- **Authentication**: JWT
- **Real-time**: SignalR
- **External APIs**: TMDB, Gemini AI, Resend Email

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Features**: SSR, SSG, React Compiler

### DevOps
- **Containerization**: Docker & Docker Compose
- **CI/CD**: Ready for deployment
- **Health Checks**: Automated monitoring

## 🎯 Features

### Core Functionality
- 🎫 Movie browsing & booking
- 🎭 Cinema & room management
- 💺 Seat selection & reservation
- 💳 Payment processing
- 🎁 Coupon & loyalty points
- ⭐ Movie reviews & ratings

### Advanced Features
- 💬 Real-time chat with AI assistant (Gemini)
- 🔐 JWT-based authentication
- 📧 Email notifications (Resend)
- 🎬 TMDB integration for movie data
- 📊 Admin dashboard
- 🔄 Auto-sync with TMDB

## 🛠️ Development

### Prerequisites
- Docker Desktop (for containerized development)
- OR:
  - .NET 10 SDK
  - Node.js 20+
  - MySQL 8.0
  - Redis 7

### Environment Setup

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd CinemaManagement
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Start services**
   ```bash
   # Docker (recommended)
   .\docker.ps1 up
   
   # OR Local development
   .\docker.ps1 db  # databases only
   # Then run API and Client separately
   ```

### Database Migrations

```bash
# Using Docker
.\docker.ps1 migrate

# OR locally
cd server/CinemaAPI
dotnet ef database update
```

## 📚 Documentation

- **[Docker Setup & Guide](README.Docker.md)** - Complete Docker documentation
- **[API Documentation](http://localhost:5000/scalar)** - Interactive API docs (when running)

## 🔧 Configuration

### Environment Variables

A single `.env` file is used for all configuration. Default values are provided, so it's **optional** for local development.

```bash
# Copy example file (optional)
cp .env.example .env

# Edit values if needed
# All settings have sensible defaults in docker-compose.yml
```

**Key variables**:
- `MYSQL_ROOT_PASSWORD` - MySQL password (default: luongthanhnhat23)
- `NEXT_PUBLIC_API_URL` - API URL for frontend (default: http://localhost:5000)
- `MONGODB_CONNECTION_STRING` - MongoDB connection (has cloud default)

See `.env.example` for all available options.

## 🚀 Deployment

### Using Docker

```bash
# Build for production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# OR use script
.\docker.ps1 up
```

See [README.Docker.md](README.Docker.md) for production deployment guide.

## 🧪 Testing

```bash
# Run API tests
cd server/CinemaAPI
dotnet test

# Run Client tests  
cd client
npm test
```

## 📊 Monitoring

### Health Checks
- **API**: http://localhost:5000/health
- **Client**: http://localhost:3000 (root)

### Logs
```bash
# View all logs
.\docker.ps1 logs

# View specific service
.\docker.ps1 logs-api
.\docker.ps1 logs-client
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

- Thanh Nhat & Nguyen Thi Nghia
- Backend Development: ASP.NET MVC + Entity Framework + MySQL + MongoDB
- Frontend Development: Next.js + TypeScript
- DevOps: Docker containerization

## 📞 Support

For issues and questions:
- Check [README.Docker.md](README.Docker.md) for Docker-related issues
- Review API logs: `.\docker.ps1 logs-api`
- Check service status: `.\docker.ps1 ps`

---
