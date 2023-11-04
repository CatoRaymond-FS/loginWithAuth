const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { db } = require('../db');

// Middleware to parse JSON request bodies
router.use(express.json());

router.post('/signup', (req, res) => {
  const { username, email, password } = req.body;

  // Check if a user with the provided email or username already exists
  checkUserExists(email, username, (userExists) => {
    if (userExists) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash the user's password before storing it in the database
    bcrypt.hash(password, 10, (hashError, hashedPassword) => {
      if (hashError) {
        console.error('Error hashing password:', hashError);
        return res.status(500).json({ error: 'User creation failed' });
      }

      // Create a new user in the users table with the hashed password
      db.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        (insertError, results) => {
          if (insertError) {
            console.error('Error creating user:', insertError);
            return res.status(500).json({ error: 'User creation failed' });
          }

          // User created successfully
          console.log('User created:', results);
          return res.status(200).json({ message: 'User created successfully' });
        }
      );
    });
  });
});

// Function to check if a user with the given email or username already exists
const checkUserExists = (email, username, callback) => {
  // Execute a database query to check for existing users
  const query = 'SELECT * FROM users WHERE email = ? OR username = ?';
  db.query(query, [email, username], (error, results) => {
    if (error) {
      console.error('Error checking for existing users:', error);
      return callback(false); // Assume no user exists on error
    }

    if (results.length > 0) {
      return callback(true); // User with the same email or username exists
    } else {
      return callback(false); // No existing user found
    }
  });
};

// Route for user login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Query the database to check if the user exists
  db.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    (queryError, results) => {
      if (queryError) {
        console.error('Error during login:', queryError);
        return res.status(500).json({ error: 'Login failed' });
      }

      if (results.length === 0) {
        // No matching user found
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = results[0];

      // Check if the provided password matches the stored hashed password
      bcrypt.compare(password, user.password, (compareError, passwordMatch) => {
        if (compareError || !passwordMatch) {
          console.error('Error during login:', compareError);
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        // User authenticated successfully
        console.log('Login successful');
        // You can generate a JWT token here and send it as a response if needed
        return res.status(200).json({ message: 'Login successful' });
      });
    }
  );
});

module.exports = router;
