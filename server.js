const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for cross-origin requests

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_mysql_username', // Replace with your MySQL username
    password: 'your_mysql_password', // Replace with your MySQL password
    database: 'goal_setting_app'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// API endpoint to register a user
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
        return res.status(400).send('All fields are required');
    }

    // Hash the password
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send('Internal server error');
        }

        // Insert user into the database
        const sql = 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)';
        db.query(sql, [username, email, hash], (err, result) => {
            if (err) {
                console.error('Error inserting user:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).send('Username or email already exists');
                }
                return res.status(500).send('Internal server error');
            }
            res.status(201).send('User registered successfully');
        });
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
