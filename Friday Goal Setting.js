const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'goal_app'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

app.post('/save-goal', (req, res) => {
    const { title, activity, purpose, milestones, stickyNotes } = req.body;

    const query = `INSERT INTO goals (title, activity, purpose, milestones, sticky_notes)
                   VALUES (?, ?, ?, ?, ?)`;

    db.query(query, [title, activity, purpose, JSON.stringify(milestones), JSON.stringify(stickyNotes)], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Database Error');
        } else {
            res.status(200).send('Goal Saved Successfully');
        }
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));
