const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

// Create the server
const app = express();

// Connect to data base
connectDB();

// Habilite cors
app.use(cors());

// Habilite express.json
app.use(express.json({ extended: true }));

// Port of the server (app)
const PORT = process.env.PORT || 5000;

// Import the routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));

// Start the sv
app.listen(PORT, () => {
    console.log(`The server is running on the port ${PORT}`);
});