require('dotenv').config();  // Ensure dotenv is loaded before using any env vars
const express = require('express');  // Import Express for server
const sql = require('mssql');  // Importing mssql for Azure SQL Database
const bcrypt = require('bcryptjs');  // Import bcrypt for hashing passwords
const cors = require('cors');  // Import CORS for handling cross-origin requests

const app = express();  // Create an Express app

// Azure SQL Database Configuration
const dbConfig = {
    user: process.env.DB_USER,           // Username from .env
    password: process.env.DB_PASSWORD,   // Password from .env
    server: process.env.DB_HOST,         // Server name from .env
    database: process.env.DB_NAME,       // Database name from .env
    port: parseInt(process.env.DB_PORT) || 1433,  // Default port for Azure SQL
    options: {
        encrypt: true,                   // Encrypt connection (recommended for Azure)
        trustServerCertificate: true     // For Azure
    }
};

// Function to hash password before saving it to the database
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);  // Generate salt with 10 rounds
    return bcrypt.hash(password, salt);     // Hash the password
}

// Middleware to allow cross-origin requests
app.use(cors());  // This allows all origins by default

// Middleware to parse JSON bodies from POST requests
app.use(express.json());

// Connect to Azure SQL Database
sql.connect(dbConfig)
    .then(() => {
        console.log('Connected to Azure SQL Server');
    })
    .catch((err) => {
        console.error('Error connecting to the database:', err.message);
    });

// API endpoint to handle user registration
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Hash the password before inserting into the database
        const hashedPassword = await hashPassword(password);

        // Insert user with hashed password into the database
        await sql.query`INSERT INTO users (username, email, password_hash) VALUES (${username}, ${email}, ${hashedPassword})`;

        // Send a success response
        res.status(201).json({ message: 'Account created successfully!' });

        // Redirect to Friday App after successful registration
        res.redirect('/Friday%20App.html');
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({ message: 'Error creating account', error });
    }
});

// Start the Express server on all available interfaces (for external access)
app.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on http://0.0.0.0:3000');
});
