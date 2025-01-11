require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 3000;  // Use port 3000 for the Express app to avoid MySQL conflict

// Middleware
app.use(cors({
    origin: 'http://localhost:63342',  // Allow frontend (running on a different port)
}));
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'pbar-server.database.windows.net',
    user: process.env.DB_USER || 'CloudSA5fa1a9f4',
    password: process.env.DB_PASSWORD || 'HwFENY,O?nv:S-"^f*<S+4%$)0&',
    database: process.env.DB_NAME || 'CloudSA5fa1a9f4'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// Test query for database connection (optional for debugging)
db.query('SELECT 1', (err, results) => {
    if (err) {
        console.error('Database test query failed:', err.message);
    } else {
        console.log('Database test query successful:', results);
    }
});

// Registration Endpoint
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Input validation
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
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO login_credentials (username, email, password_hash, date_created)
            VALUES (?, ?, ?, NOW())
        `;

        db.query(query, [username, email, hashedPassword], (err, results) => {
            if (err) {
                console.error('Error inserting data:', err.message);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).send('Username or email already exists.');
                }
                return res.status(500).send('Server error while inserting data.');
            }
            res.status(201).json({ message: 'User registered successfully.' });
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).send('Server error while hashing the password.');
    }
});

// Login Endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('All fields are required.');
    }

    const query = `SELECT * FROM login_credentials WHERE email = ?`;

    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Error fetching data:', err.message);
            return res.status(500).send('Server error while fetching data.');
        }

        if (results.length === 0) {
            return res.status(400).send('Invalid email or password.');
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(400).send('Invalid email or password.');
        }

        res.status(200).json({ message: 'Login successful!' });
    });
});

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).send('Server is healthy!');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack);
    res.status(500).send('An unexpected error occurred.');
});

// Start the Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
