// route client will have to fetch from //
const {notes} = require('./data/db');

const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

// callback function that will execute every time route is accessed with a get request //
app.get('/api/db', (req, res) => {
    let results = notes;
    res.json(results);
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});