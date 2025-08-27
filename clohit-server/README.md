# Clohit Server

A Node.js/Express server with MongoDB integration for the Clohit e-commerce application.

## Features

- MongoDB database connection
- RESTful API endpoints for men's and women's products
- Mongoose schemas for data validation
- CORS enabled for frontend integration
- Sample data seeding functionality

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure MongoDB Connection**
   
   Update the `config.env` file with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/clohit
   PORT=5000
   ```
   
   For MongoDB Atlas, use:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/clohit
   ```

3. **Start the Server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

4. **Seed the Database**
   
   After starting the server, make a POST request to seed the database with sample data:
   ```bash
   curl -X POST http://localhost:5000/api/seed-data
   ```
   
   Or use a tool like Postman to make the request.

## API Endpoints

### Health Check
- `GET /api/health` - Check if server is running

### Men's Products
- `GET /api/men-products` - Get all men's products
- `POST /api/men-products` - Add a new men's product

### Women's Products
- `GET /api/women-products` - Get all women's products
- `POST /api/women-products` - Add a new women's product

### Database Management
- `POST /api/seed-data` - Seed database with sample data

## Database Schemas

### MenProduct Schema
```javascript
{
  Image: String (required),
  Brand: String (required),
  Description: String (required, unique),
  Mrp: String (required),
  Price: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

### WomenProduct Schema
```javascript
{
  Image: String (required),
  Brand: String (required),
  Description: String (required, unique),
  Mrp: String (required),
  Price: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

## Frontend Integration

To connect your React frontend to this server, update your API calls to use the server endpoints:

```javascript
// Example: Fetch men's products
const response = await fetch('http://localhost:5000/api/men-products');
const menProducts = await response.json();

// Example: Fetch women's products
const response = await fetch('http://localhost:5000/api/women-products');
const womenProducts = await response.json();
```

## Environment Variables

Create a `config.env` file in the root directory with:
- `MONGODB_URI`: Your MongoDB connection string
- `PORT`: Server port (default: 5000)

## Troubleshooting

1. **MongoDB Connection Error**: Ensure MongoDB is running and the connection string is correct
2. **Port Already in Use**: Change the PORT in config.env or kill the process using the port
3. **CORS Issues**: The server is configured with CORS enabled for all origins in development

## Development

The server uses nodemon for development, which automatically restarts when files change.

