const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: 'sql12.freesqldatabase.com\n', // Change this to your database host (e.g., '127.0.0.1')
    user: 'ctllodder@gmail.com',      // Your MySQL username
    password: 'PBardsleyCLodder558087!\n',      // Your MySQL password
    database: 'freesqldatabase' // Replace with your database name
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// Handle Registration Request
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    // Check for missing fields
    if (!username || !email || !password) {
        return res.status(400).send('All fields are required.');
    }

    // Insert into the database
    const query = `
        INSERT INTO login_credentials (username, email, password_hash, date_created)
        VALUES (?, ?, ?, NOW())
    `;

    db.query(query, [username, email, password], (err, results) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).send('Server error.');
        }
        res.status(201).send('User registered successfully.');
    });
});

// Start the Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
