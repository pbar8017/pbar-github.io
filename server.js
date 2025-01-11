require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12756717',
    password: '1y1LtGdjF4',
    database: 'sql12756717'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// Handle Registration Request
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || username.length < 3) {
        return res.status(400).send('Username must be at least 3 characters long.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).send('Invalid email format.');
    }

    if (!password || password.length < 8) {
        return res.status(400).send('Password must be at least 8 characters long.');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO login_credentials (username, email, password_hash, date_created)
            VALUES (?, ?, ?, NOW())
        `;

        db.query(query, [username, email, hashedPassword], (err, results) => {
            if (err) {
                console.error('Error inserting data:', err.message || err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).send('Username or email already exists.');
                }
                return res.status(500).send('Server error.');
            }
            res.status(201).send('User registered successfully.');
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).send('Server error.');
    }
});

// Health Check Route
app.get('/health', (req, res) => {
    res.status(200).send('Server is healthy!');
});

// Start the Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
