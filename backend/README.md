# Bookstore Backend API

A complete Express.js backend API for the bookstore application with PostgreSQL database integration.

## Features

- ✅ User authentication (Register/Login with JWT)
- ✅ Book management and search
- ✅ Shopping cart functionality
- ✅ Order management
- ✅ Book reviews and ratings
- ✅ Wishlist support
- ✅ Inventory tracking

## Prerequisites

- Node.js (v14+)
- PostgreSQL (v12+)
- npm

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Update `.env` file with your PostgreSQL credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bookstore_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_secret_key_12345_change_this_in_production
PORT=5000
NODE_ENV=development
```

### 3. Run the Server

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

#### Register User

```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe"
}
```

#### Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get User Profile

```
GET /api/auth/profile
Authorization: Bearer <token>
```

### Books

#### Get All Books

```
GET /api/books?page=1&limit=10&category_id=1&search=harry
```

#### Get Book by ID

```
GET /api/books/:id
```

#### Get Categories

```
GET /api/books/categories
```

#### Add Review

```
POST /api/books/:id/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "review_text": "Great book!"
}
```

### Shopping Cart

#### Get Cart

```
GET /api/cart
Authorization: Bearer <token>
```

#### Add to Cart

```
POST /api/cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "book_id": 1,
  "quantity": 2
}
```

#### Update Cart Item Quantity

```
PUT /api/cart/update/:book_id
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}
```

#### Remove from Cart

```
DELETE /api/cart/remove/:book_id
Authorization: Bearer <token>
```

#### Clear Cart

```
DELETE /api/cart/clear
Authorization: Bearer <token>
```

### Orders

#### Create Order

```
POST /api/orders/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "shipping_address": "123 Main St, New York, NY 10001",
  "billing_address": "123 Main St, New York, NY 10001",
  "payment_method": "credit_card"
}
```

#### Get User Orders

```
GET /api/orders
Authorization: Bearer <token>
```

#### Get Order Details

```
GET /api/orders/:order_id
Authorization: Bearer <token>
```

#### Cancel Order

```
POST /api/orders/:order_id/cancel
Authorization: Bearer <token>
```

## Project Structure

```
backend/
├── config/
│   └── database.js          # PostgreSQL connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── bookController.js    # Book management logic
│   ├── cartController.js    # Cart logic
│   └── orderController.js   # Order logic
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── routes/
│   ├── auth.js              # Auth endpoints
│   ├── books.js             # Book endpoints
│   ├── cart.js              # Cart endpoints
│   └── orders.js            # Order endpoints
├── .env                     # Environment variables
├── .gitignore               # Git ignore rules
├── package.json             # Project dependencies
├── server.js                # Main server file
└── README.md                # This file
```

## Error Handling

All endpoints return JSON responses with appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict (e.g., duplicate email)
- `500` - Server Error

Example error response:

```json
{
  "message": "Invalid email or password"
}
```

## Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication (7-day expiration)
- ✅ CORS enabled for frontend communication
- ✅ Input validation
- ✅ Protected routes with authentication middleware

## Testing APIs

You can test the APIs using:

- **Postman** - Import endpoints and test with GUI
- **cURL** - Command line requests
- **Thunder Client** - VS Code extension
- **REST Client** - VS Code extension

Example cURL request:

```bash
curl -X GET http://localhost:5000/api/books \
  -H "Content-Type: application/json"
```

## Troubleshooting

### Database Connection Error

- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database `bookstore_db` exists

### Port Already in Use

- Change `PORT` in `.env` file
- Or kill the process: `lsof -ti:5000 | xargs kill -9`

### Token Expired

- Get a new token by logging in again
- Tokens expire after 7 days

## Next Steps

1. Connect the frontend to these APIs
2. Add admin endpoints for book management
3. Implement payment integration (Stripe/PayPal)
4. Add email notifications
5. Implement wishlist endpoints
