# QuickBite API - Copilot Instructions

This is the QuickBite Food Menu Management API project built with Node.js, Express, and SQLite following Test-Driven Development (TDD) principles.

## Project Overview

- [x] **Project Created**: Node.js/Express RESTful API
- [x] **Database**: SQLite with Sequelize ORM  
- [x] **Testing**: Comprehensive TDD test suite with Jest
- [x] **Documentation**: Swagger/OpenAPI documentation
- [x] **Security**: Parameterized queries, input validation
- [x] **Deployment**: Dockerfile included

## Development Status

- [x] Project scaffolded and configured
- [x] Database models and migrations created
- [x] CRUD operations implemented and tested
- [x] API documentation generated
- [x] All tests passing (48/48)
- [x] Development server running on port 3001
- [x] Security best practices implemented

## Available Commands

- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm test` - Run test suite
- `npm run test:coverage` - Generate test coverage report

## API Endpoints

- `GET /health` - Health check
- `GET /api/menu-items` - Get all menu items
- `GET /api/menu-items/:id` - Get menu item by ID
- `POST /api/menu-items` - Create new menu item
- `PUT /api/menu-items/:id` - Update menu item
- `DELETE /api/menu-items/:id` - Delete menu item
- `GET /api/menu-items/search?q=term` - Search menu items

## Documentation

- API Documentation: http://localhost:3001/api-docs
- Project README.md includes complete setup instructions
- All code includes comprehensive inline documentation

## Security Features

- Parameterized queries via Sequelize ORM
- Input validation and sanitization
- CORS protection
- Security headers with Helmet.js
- No raw SQL concatenation