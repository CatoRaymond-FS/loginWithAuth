const express = require('express');
const app = express();
const cors = require('cors');
const authRoute = require('./routes/auth');

// Other middleware and configuration here
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Use the auth route for user signup and login
app.use('/api/auth', authRoute);


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
