# QuickBite Food Menu Management API

A secure, well-teste## API Documentation

Once the server is running, access the Swagger documentation at:
`http://localhost:3001/api-docs`

### Sample API Usage

```bash
# Get all menu items
curl http://localhost:3001/api/menu-items

# Create a new menu item
curl -X POST http://localhost:3001/api/menu-items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Margherita Pizza",
    "description": "Classic pizza with tomato sauce, mozzarella, and fresh basil",
    "price": 12.99,
    "category": "main",
    "dietaryTag": "vegetarian"
  }'

# Search menu items
curl "http://localhost:3001/api/menu-items/search?q=pizza"
```STful API for restaurant menu management built with Node.js, Express, and SQLite following Test-Driven Development (TDD) principles.

## Features

- **CRUD Operations** for menu items (Create, Read, Update, Delete)
- **SQLite Database** for data persistence
- **Test-Driven Development** with comprehensive test coverage
- **API Documentation** with Swagger/OpenAPI
- **Security Best Practices** with parameterized queries
- **Docker Support** for easy deployment

## Menu Item Schema

Each menu item contains:
- `id` - Unique identifier
- `name` - Item name
- `description` - Item description
- `price` - Item price
- `category` - Food category (appetizer, main, dessert, beverage)
- `dietaryTag` - Dietary information (vegetarian, vegan, gluten-free, etc.)

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the application:
```bash
npm run dev
```

3. The API will be available at `http://localhost:3000`

### Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

## API Documentation

Once the server is running, access the Swagger documentation at:
`http://localhost:3000/api-docs`

## API Endpoints

- `GET /api/menu-items` - Get all menu items
- `GET /api/menu-items/:id` - Get menu item by ID
- `POST /api/menu-items` - Create new menu item
- `PUT /api/menu-items/:id` - Update menu item
- `DELETE /api/menu-items/:id` - Delete menu item

## Docker

Build and run with Docker:

```bash
docker build -t quickbite-api .
docker run -p 3000:3000 quickbite-api
```

## Project Structure

```
src/
├── controllers/     # Route controllers
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
├── config/         # Configuration files
├── tests/          # Test files
└── app.js          # Application entry point
```

## Development Guidelines

This project follows Test-Driven Development (TDD):
1. Write failing tests first
2. Implement minimal code to pass tests
3. Refactor while keeping tests green

## Security

- Uses parameterized queries via Sequelize ORM
- Input validation and sanitization
- CORS protection
- Security headers with Helmet.js

## Development Summary

### Copilot-Assisted Development Experience

#### ✅ **What Copilot Helped Achieve Faster**
**Comprehensive Test Suite Generation**: Copilot significantly accelerated the TDD process by generating complete test files with edge cases and error scenarios. When creating the `MenuItemController.test.js`, `MenuItemService.test.js`, and `MenuItem.test.js` files, Copilot automatically suggested comprehensive test cases including:
- CRUD operation tests with success and failure scenarios
- Validation tests for invalid data inputs
- Database constraint testing
- Search functionality tests
- HTTP status code validations

This saved hours of manual test case writing and ensured comprehensive coverage from the start, allowing the project to maintain true TDD principles with failing tests written before implementation.

#### 🔄 **When Copilot Code Required Rejection/Refactoring**
**Data Type Assertions in Tests**: Initially, Copilot generated test expectations that assumed price values would be returned as strings (e.g., `expect(result.price).toBe(menuItemData.price.toString())`), but the actual Sequelize model returned them as numbers. This required refactoring multiple test files to correct the assertions:

```javascript
// Copilot's initial suggestion (rejected):
expect(response.body.data.price).toBe(newMenuItem.price.toString());

// Refactored to match actual behavior:
expect(response.body.data.price).toBe(newMenuItem.price);
```

This taught the importance of understanding the actual data types returned by the ORM rather than blindly accepting AI suggestions, emphasizing the need for developer validation of AI-generated code against real system behavior.