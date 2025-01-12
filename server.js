require('dotenv').config();  // Make sure this is at the top
const sql = require('mssql');  // Importing mssql for Azure SQL Database
console.log('DB Host:', process.env.DB_HOST);
console.log('DB User:', process.env.DB_USER);
console.log('DB Name:', process.env.DB_NAME);

// Azure SQL Database Configuration
const dbConfig = {
    user: process.env.DB_USER,            // Username from .env
    password: process.env.DB_PASSWORD,    // Password from .env
    server: process.env.DB_HOST,          // Server name from .env
    database: process.env.DB_NAME,        // Database name from .env
    port: parseInt(process.env.DB_PORT) || 1433,  // Default port for Azure SQL
    options: {
        encrypt: true,  // Encrypt connection (recommended for Azure)
        trustServerCertificate: true  // For Azure
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

// Test query for database connection (optional for debugging)
sql.query('SELECT 1')
    .then((result) => {
        console.log('Test query result:', result);
    })
    .catch((err) => {
        console.error('Database test query failed:', err.message);
    });
