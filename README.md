# BookStore

Full-stack bookstore project with:

- React frontend
- Express backend
- PostgreSQL database

## Prerequisites

- Node.js
- npm
- PostgreSQL
- Git

## Clone The Repo

```bash
git clone https://github.com/HeerRana/BookStore.git
cd BookStore
```

## Create Environment Files

Copy the example files to local `.env` files:

```bash
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

## Configure Backend Environment

Open `backend/.env` and set your local PostgreSQL values:

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

## Configure Frontend Environment

Open `frontend/.env` and keep this value for local development:

```env
VITE_API_BASE_URL=http://localhost:5001/api
```

## Create PostgreSQL Database

Make sure PostgreSQL is running, then create the database:

```sql
CREATE DATABASE bookstore_db;
```

## Install Dependencies

Install backend packages:

```bash
cd backend
npm install
```

Install frontend packages:

```bash
cd ..\frontend
npm install
```

## Run The Project

Start the backend in one terminal:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm start
```

## Local URLs

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5001`

## Notes

- Do not commit your real `.env` files
- Use `.env.example` as the setup reference
- If PostgreSQL runs on a different port or username, update `backend/.env`
