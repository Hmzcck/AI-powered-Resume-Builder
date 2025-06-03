# AI-powered Resume Builder

A modern, full-stack resume builder application that leverages AI technology to help users create professional resumes with intelligent suggestions and feedback.

## 🚀 Features

- **AI-Powered Resume Generation**: Generate complete resumes or specific sections using AI
- **Intelligent Resume Analysis**: Get AI feedback and scoring for your resume
- **Interactive Resume Builder**: User-friendly interface with drag-and-drop functionality
- **Real-time Preview**: See changes to your resume instantly
- **Multiple Resume Templates**: Choose from various professional templates
- **User Authentication**: Secure user accounts with JWT authentication
- **Resume Management**: Save, edit, and manage multiple resumes
- **PDF Export**: Export resumes to PDF format
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI components
- **Zustand** - State management
- **React Quill** - Rich text editor
- **dnd-kit** - Drag and drop functionality

### Backend
- **.NET 8** - Modern web API framework
- **Clean Architecture** - Domain-driven design pattern
- **Entity Framework Core** - ORM for database operations
- **JWT Authentication** - Secure user authentication
- **Swagger/OpenAPI** - API documentation
- **MediatR** - CQRS pattern implementation
- **Google Gemini AI** - AI service integration

## 📁 Project Structure

```
AI-powered-Resume-Builder/
├── frontend/                    # Next.js frontend application
│   ├── src/
│   │   ├── app/                # App router pages
│   │   ├── components/         # Reusable UI components
│   │   ├── stores/            # State management
│   │   ├── types/             # TypeScript definitions
│   │   └── utils/             # Helper functions
│   └── public/                # Static assets
├── src/                        # .NET backend solution
│   ├── AI-powered-Resume-Builder.Domain/         # Domain layer
│   ├── AI-powered-Resume-Builder.Application/    # Application layer
│   ├── AI-powered-Resume-Builder.Infrastructure/ # Infrastructure layer
│   └── AI-powered-Resume-Builder.WebApi/        # Web API layer
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [SQL Server](https://www.microsoft.com/en-us/sql-server) or SQL Server Express
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/AI-powered-Resume-Builder.git
   cd AI-powered-Resume-Builder
   ```

2. **Setup Backend (.NET API)**
   ```bash
   cd src/AI-powered-Resume-Builder.WebApi
   
   # Restore dependencies
   dotnet restore
   
   # Update database connection string in appsettings.json
   # Add your Gemini AI API key to appsettings.json
   
   # Run database migrations
   dotnet ef database update
   
   # Start the API
   dotnet run
   ```
   The API will be available at `https://localhost:7001` and `http://localhost:5000`

3. **Setup Frontend (Next.js)**
   ```bash
   cd frontend
   
   # Install dependencies
   npm install
   
   # Start development server
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`

### Configuration

1. **Backend Configuration** (`src/AI-powered-Resume-Builder.WebApi/appsettings.json`):
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Your SQL Server connection string"
     },
     "JwtSettings": {
       "SecretKey": "Your JWT secret key",
       "Issuer": "Your issuer",
       "Audience": "Your audience"
     },
     "GeminiSettings": {
       "ApiKey": "Your Google Gemini API key"
     }
   }
   ```

2. **Frontend Configuration**:
   - Update API endpoints in service files if needed
   - Configure environment variables for production deployment

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/users` - Get all users (admin)

### Resume Management
- `GET /api/resume` - Get all user resumes
- `GET /api/resume/{id}` - Get specific resume
- `POST /api/resume` - Create new resume
- `PUT /api/resume` - Update resume
- `DELETE /api/resume/{id}` - Delete resume

### AI Features
- `POST /api/ai/generate-resume` - Generate complete resume
- `POST /api/ai/generate-resume-from-jobs` - Generate resume from job descriptions
- `POST /api/ai/generate-resume-section` - Generate specific resume section
- `GET /api/ai/feedback/{resumeId}` - Get AI feedback for resume
- `POST /api/ai/calculate-score` - Calculate resume score

### AI Feedback
- `GET /api/aifeedback` - Get all AI feedback
- `GET /api/aifeedback/{id}` - Get specific feedback
- `POST /api/aifeedback` - Create feedback
- `PUT /api/aifeedback` - Update feedback
- `DELETE /api/aifeedback/{id}` - Delete feedback

## 🏗️ Architecture

The backend follows **Clean Architecture** principles:

- **Domain Layer**: Core business entities and interfaces
- **Application Layer**: Use cases, commands, queries, and DTOs
- **Infrastructure Layer**: External dependencies, database, AI services
- **WebApi Layer**: Controllers, middleware, and API configuration

Key patterns used:
- **CQRS** with MediatR
- **Repository Pattern**
- **Dependency Injection**
- **JWT Authentication**

## 🧪 Testing

```bash
# Run backend tests
cd src
dotnet test

# Run frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Publish the application:
   ```bash
   dotnet publish -c Release -o ./publish
   ```
2. Deploy to your preferred hosting service (Azure, AWS, etc.)
3. Configure production database and AI API keys

### Frontend Deployment
1. Build the application:
   ```bash
   npm run build
   ```
2. Deploy to Vercel, Netlify, or your preferred hosting service

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Hamza Çiçek**

## 🔮 Future Enhancements

- [ ] Multiple resume templates
- [ ] Resume analytics dashboard
- [ ] ATS optimization scoring
- [ ] Resume comparison tools
- [ ] Multi-language support

---

**Happy Resume Building!** 🎉
