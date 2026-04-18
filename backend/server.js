const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const pool = require('./config/database');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

const seedAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

  try {
    const result = await pool.query('SELECT id, role FROM users WHERE email = $1', [adminEmail]);

    if (result.rows.length > 0) {
      const existingUser = result.rows[0];
      if (existingUser.role !== 'admin') {
        await pool.query('UPDATE users SET role = $1 WHERE id = $2', ['admin', existingUser.id]);
        console.log(`Updated existing user ${adminEmail} to admin role`);
      } else {
        console.log(`Admin user already exists: ${adminEmail}`);
      }
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, role, is_active) VALUES ($1, $2, $3, $4, $5, $6)',
      [adminEmail, hashedPassword, 'Admin', 'User', 'admin', true]
    );
    console.log(`Seeded default admin account: ${adminEmail}`);
  } catch (error) {
    console.error('Failed to seed admin user:', error.message || error);
  }
};

const startServer = async () => {
  await seedAdminUser();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
};

startServer();
