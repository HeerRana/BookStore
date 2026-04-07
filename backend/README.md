# Bookstore Backend API

Express backend API for the BookStore project with PostgreSQL integration.

## Features

- User authentication with JWT
- Book listing and search
- Shopping cart support
- Order management

## Prerequisites

- Node.js
- npm
- PostgreSQL

## Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Create environment file

```bash
copy .env.example .env
```

Update `.env` with your local PostgreSQL credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bookstore_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_own_strong_secret
PORT=5001
NODE_ENV=development
```

### 3. Create the database

```sql
CREATE DATABASE bookstore_db;
```

### 4. Run the server

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

The backend runs at `http://localhost:5001`.

## Main API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `GET /api/books`
- `GET /api/books/:id`
- `GET /api/books/categories`
- `GET /api/cart`
- `POST /api/cart/add`
- `PUT /api/cart/update/:book_id`
- `DELETE /api/cart/remove/:book_id`
- `DELETE /api/cart/clear`
- `POST /api/orders/create`
- `GET /api/orders`
- `GET /api/orders/:order_id`
- `POST /api/orders/:order_id/cancel`

## Project Structure

```text
backend/
|-- config/
|   |-- database.js
|-- controllers/
|   |-- authController.js
|   |-- bookController.js
|   |-- cartController.js
|   |-- orderController.js
|-- middleware/
|   |-- auth.js
|-- routes/
|   |-- auth.js
|   |-- books.js
|   |-- cart.js
|   |-- orders.js
|-- .env.example
|-- .gitignore
|-- package.json
|-- server.js
|-- README.md
```

## Troubleshooting

### Database connection issues

- Make sure PostgreSQL is running
- Check values in `.env`
- Confirm `bookstore_db` exists

### Port issues

- Change `PORT` in `.env` if needed
- Make sure port `5001` is not already in use
