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
    host: 'sql12.freesqldatabase.com', // Ensure correct host
    user: 'sql12756717',      // Replace with your MySQL username
    password: '1y1LtGdjF4',  // Replace with your MySQL password
    database: 'sql12756717'    // Replace with your database name
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

    if (!username || !email || !password) {
        return res.status(400).send('All fields are required.');
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
                return res.status(500).send('Server error.');
            }
            res.status(201).send('User registered successfully.');
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).send('Server error.');
    }
});

// Start the Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
