# Clohit

This repository contains both the backend (Node.js/Express) and frontend (React) for the Clohit e-commerce project.

---

## Clohit Server (Backend)

Node.js/Express backend for the Clohit e-commerce project.

### Features
- RESTful API for products, users, orders, and admin
- MongoDB with Mongoose
- JWT authentication
- Inventory management
- Database seeding for demo data

### Prerequisites
- Node.js (v14 or higher)
- npm
- MongoDB (local or Atlas)

### Setup & Run
1. **Install dependencies:**
   ```bash
   cd clohit-server
   npm install
   ```
2. **Configure environment variables:**
   - Edit `config.env`:
     ```
     MONGODB_URI=your_mongodb_connection_string
     PORT=5000
     JWT_SECRET=your_jwt_secret
     ```
3. **Start the server:**
   - For development (with auto-restart):
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```
   The server will run at [http://localhost:5000](http://localhost:5000).
4. **Seed the database (optional):**
   ```bash
   curl -X POST http://localhost:5000/api/seed-data
   ```

### API Endpoints
- **Products:** `/api/men-products`, `/api/women-products`
- **Auth:** `/api/auth/login`, `/api/auth/signup`
- **Orders:** `/api/customer/orders`
- **Admin:** `/api/admin/...`

### Payment Integration
- To add online payments (e.g., Razorpay, Stripe):
  1. Register and get API keys.
  2. Install the SDK:
     ```bash
     npm install razorpay
     ```
  3. Add payment routes (see payment gateway docs).
  4. Update the frontend to use the payment gateway’s checkout.

### Notes
- Ensure MongoDB is running and accessible.
- Update `config.env` with your credentials.
- For production, use secure secrets and environment variables.

---

## Client_Clohit (Frontend)

This is the frontend for the Clohit e-commerce project, built with React and Vite.

### Features
- Modern React (with hooks and context)
- Routing with React Router
- Wishlist and Bag management
- Responsive UI with Bootstrap
- FontAwesome icons

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Setup & Run
1. **Install dependencies:**
   ```bash
   cd Client_Clohit
   npm install
   ```
2. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will run at [http://localhost:5173](http://localhost:5173) (default Vite port).
3. **Build for production:**
   ```bash
   npm run build
   ```
4. **Preview production build:**
   ```bash
   npm run preview
   ```

### Project Structure
```
Client_Clohit/
├── public/
├── src/
│   ├── auth/
│   ├── main_component/
│   ├── assets/
│   ├── AddbagContext.jsx
│   ├── WishlistContext.jsx
│   └── ...
├── index.html
├── package.json
└── vite.config.js
```

### API
- The frontend expects the backend server (`clohit-server`) to be running at `http://localhost:5000` by default.
- Update API URLs in your code if your backend runs elsewhere.

### Notes
- Make sure to run the backend server before using the app.
- For payment integration, follow the backend instructions and update the frontend to use the payment gateway's checkout flow. 
