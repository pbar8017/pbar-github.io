require('dotenv').config();
const sql = require('mssql'); // Importing mssql for Azure SQL Database
const express = require('express');

const app = express();

// Azure SQL Database Configuration
const dbConfig = {
    user: process.env.DB_USER,               // Username from .env
    password: process.env.DB_PASSWORD,       // Password from .env
    server: process.env.DB_HOST,             // Server name from .env
    database: process.env.DB_NAME,           // Database name from .env
    port: parseInt(process.env.DB_PORT) || 1433, // Use port 1433 for Azure SQL
    options: {
        encrypt: true,                       // Encrypt connection (recommended for Azure)
        trustServerCertificate: true         // For Azure
    }
};

// Connect to Azure SQL Database
sql.connect(dbConfig)
    .then(() => {
        console.log('Connected to Azure SQL Server');
    })
    .catch((err) => {
        console.error('Error connecting to the database:', err.message);
    });

// Register API endpoint
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    // SQL query to insert the new user
    const query = `
        INSERT INTO users (username, email, password)
        VALUES ('${username}', '${email}', '${password}');
    `;

    sql.query(query)
        .then(() => {
            res.status(200).json({ message: 'User created successfully!' });
        })
        .catch((err) => {
            res.status(500).json({ message: 'Error creating user', error: err.message });
        });
});

// Start Express server
const port = 3000; // This should be a different port from your Azure SQL server (1433)
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
