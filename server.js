// route client will have to fetch from //
const {notes} = require('./data/db');

const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

// parse incoming string or array data //
app.use(express.urlencoded({extended: true}));

// parse incoming JSON data //
app.use(express.json());

// callback function that will execute every time route is accessed with a get request //
app.get('/api/db', (req, res) => {
    let results = notes;
    res.json(results);
});

app.get('/api/db/:id', (req, res) => {
    const result = findById(req.params.id, notes);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

// endpoint that accepts data from the client to be stored on the server //
app.post('/api/db', (req, res) => {
    // req.body is where the incoming content will be //
    console.log(req.body);
    res.json()
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});