const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

console.log('step 1');
// Create the server
const app = express();
console.log('step 2');
// Connect to data base
connectDB();
console.log('step 3');
// Habilite cors
app.use(cors());

// Habilite express.json
app.use(express.json({ extended: true }));
console.log('step 4');
// Port of the server (app)
const port = process.env.port || 5000;

// Import the routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));

console.log('step 5');
// Start the sv
app.listen(port, '0.0.0.0', () => {
    console.log(`The server is running on the port ${port}`);
});

console.log('step 6');