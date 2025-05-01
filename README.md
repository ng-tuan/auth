# Modern Authentication System

A modern, secure authentication system built with Next.js, TypeScript, and Tailwind CSS. Features a beautiful dark theme UI with a focus on user experience and security.

## Features

### User Interface
- 🎨 Modern dark theme design
- 🌊 Smooth transitions and animations
- 📱 Fully responsive layout
- 💫 Loading states and feedback
- 🚨 Error handling with popup messages
- 👁️ Password visibility toggle

### Authentication
- 👤 Username-based authentication
- 🔒 Secure password handling
- ✨ User registration with validation
- 🎯 Form validation and error handling
- 🔄 Loading states during API calls
- 📝 Success/Error feedback system

### Technical Features
- ⚡ Built with Next.js 13+ (App Router)
- 📘 TypeScript for type safety
- 🎨 Tailwind CSS for styling
- 🔧 Modular component architecture
- 🛡️ Secure API integration
- 🎭 Custom popup component
- ⏳ Custom loading component

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd auth
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd fe
npm install

# Install backend dependencies
cd ../be
npm install
```

3. Set up environment variables:
```bash
# Frontend (.env.local)
cp fe/.env.example fe/.env.local

# Example frontend environment variables:
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
PORT=3001

# Backend (.env)
cp be/.env.example be/.env

# Example backend environment variables:
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=rootp
DB_NAME=auth_db
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CORS_ORIGIN=http://localhost:3001
```

4. Start the development servers:

```bash
# Frontend
cd fe
npm run dev

# Backend
cd be
npm run dev
```

Or using Docker:
```bash
docker-compose up
```

The application will be available at:
- Frontend: http://localhost:3001
- Backend: http://localhost:3000
- Database: localhost:3307 (MySQL)

## Docker Services

### Backend Service
- Node.js application
- Runs on port 3000
- Connected to MySQL database
- Auto-restarts unless stopped manually

### Database Service
- MySQL 8
- Port: 3307 (host) -> 3306 (container)
- Includes health check
- Persistent volume for data storage

## Project Structure

```
auth/
├── fe/                    # Frontend (Next.js)
│   ├── src/
│   │   ├── app/          # App router pages
│   │   ├── components/   # Reusable components
│   │   └── config/       # Configuration files
│   └── public/           # Static files
│
└── be/                    # Backend
    ├── src/
    │   ├── controllers/  # Route controllers
    │   ├── middlewares/  # Custom middlewares
    │   ├── models/       # Data models
    │   ├── routes/       # API routes
    │   └── utils/        # Utility functions
    └── config/           # Backend configuration
```

## Components

### Popup Component
- Reusable popup for success/error messages
- Supports multiple states (success, error, warning)
- Customizable content and actions
- Smooth animations

### Loading Component
- Fullscreen or inline loading states
- Customizable messages
- Smooth spinner animation
- Backdrop blur effect

## Security Features

- Password hashing
- Rate limiting
- CORS protection
- HTTP-only cookies
- Input validation
- XSS protection
- CSRF protection

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify authentication

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- React Icons for the beautiful icons 