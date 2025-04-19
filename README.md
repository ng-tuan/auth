# Authentication API Service

A robust authentication system built with TypeScript, Express.js, and Sequelize ORM, providing secure user registration, login, and token management.

## Project Overview

This project implements a RESTful API for user authentication with JWT tokens, featuring:

- User registration with password strength validation
- Secure login with account locking after failed attempts
- JWT and refresh token implementation
- Rate limiting protection against brute force attacks
- MySQL database integration via Sequelize ORM
- Docker containerization for easy deployment

## Project Structure

```
auth/
├── src/                    # Source code
│   ├── config/             # Configuration files
│   │   └── db.ts           # Database connection setup
│   ├── controllers/        # Route controllers
│   │   ├── authController.ts
│   │   └── ...
│   ├── enum/               # Constants and enums
│   │   └── AppConst.ts     # Application constants
│   ├── middlewares/        # Middleware functions
│   │   └── authMiddleware.ts # JWT authentication middleware
│   ├── models/             # Sequelize data models
│   │   ├── User.ts         # User model with authentication methods
│   │   └── ...
│   ├── services/           # Business logic layer
│   │   ├── authService.ts  # Authentication service
│   │   └── ...
│   ├── utils/              # Utility functions
│   │   ├── logger.ts       # Logging utility
│   │   ├── rateLimiter.ts  # Rate limiting implementation
│   │   └── ...
│   └── app.ts              # Application entry point
├── .env                    # Environment variables
├── .eslintrc.json          # ESLint configuration
├── .prettierrc             # Prettier configuration
├── docker-compose.yml      # Docker Compose configuration
├── Dockerfile              # Docker container configuration
├── package.json            # Project dependencies
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

## Key Features

- **Secure Authentication Flow**: Complete JWT-based authentication system
- **Account Protection**: Automatic account locking after multiple failed login attempts
- **Rate Limiting**: Protection against brute force attacks
- **Password Security**: Strong password validation and bcrypt hashing
- **Refresh Tokens**: Support for token refresh without requiring re-login
- **Containerization**: Docker setup for consistent deployment
- **TypeScript**: Type-safe code with modern JavaScript features

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL database
- Docker and Docker Compose (for containerized setup)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DB_HOST=localhost
DB_NAME=auth
DB_USER=root
DB_PASSWORD=your_password
DB_PORT=3306
PORT=3000
JWT_SECRET=your_secret_key
```

### Local Development Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd auth
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up the database:
   ```
   # Create a MySQL database named 'auth'
   ```

4. Start the development server:
   ```
   npm run dev
   ```

### Docker Setup

1. Build and start the containers:
   ```
   docker-compose up --build
   ```

2. The API will be available at http://localhost:8080

## API Endpoints

### Authentication

- **POST /api/auth/register**
  - Register a new user
  - Request body: `{ "user_name": "example", "password": "StrongPass123!" }`

- **POST /api/auth/login**
  - Login with existing credentials
  - Request body: `{ "user_name": "example", "password": "StrongPass123!" }`
  - Returns: JWT access token and refresh token

- **POST /api/auth/refresh-token**
  - Get a new access token using refresh token
  - Request body: `{ "refreshToken": "your-refresh-token" }`
  - Returns: New access token and refresh token

## Code Quality and Formatting

This project uses ESLint and Prettier for code quality and formatting.

- **Format code**:
  ```
  npm run format
  ```

- **Check and fix linting issues**:
  ```
  npm run lint
  npm run lint:fix
  ```

- **Fix all formatting and linting issues**:
  ```
  npm run fix
  ```

## Security Considerations

- JWT secrets should be strong and kept secure
- In production, consider implementing:
  - HTTPS for all API endpoints
  - More sophisticated rate limiting (e.g., Redis-based)
  - Regular security audits and dependency updates

## License

ISC

## Author

TuanNT 