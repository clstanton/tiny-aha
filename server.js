// write data to db.json
const fs = require('fs');
const path = require('path');

// route client will have to fetch from //
const {notes} = require('./data/db');

const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

// unique id generator //
const uniqid = require('uniqid');

/// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));

// parse incoming JSON data
app.use(express.json());

app.use(express.static('public'));

// note creation function //
function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './data/db.json'),
        JSON.stringify({notes: notesArray}, null, 2)
    );

    // Return finished code to post route for response //
    return note;
}

// filter function //
function filterByQuery(query, notesArray) {
    let filteredResults = notesArray;
    if (query.title) {
        filteredResults = filteredResults.filter(note => note.title === query.title);
      }
      return filteredResults;
}

// validation function //
function validateNote(note) {
    if (!note.title || typeof note.title !== 'string') {
        return false;
    }
    return true;
}

// argument 1. string that describes the route the client will have to fetch from //
// argument 2. callback function that will execute every time route is accessed with a get request //
app.get('/api/notes', (req, res) => {
    let results = notes;
    if (req.query) {
        results = filterByQuery(req.query,results);
    }
    res.json(results);
});

// HTML ROUTE: get index.html to be served from express.js server //
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// HTML ROUTE: get notes.html to be served from express.js server //
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// endpoint that accepts data from the client to be stored on the server //
app.post('/api/notes', (req, res) => {
    // req.body is where the incoming content will be //
    // set id based on what the next index of the array will be //
    req.body.id = uniqid();

    // if any data in req.body is incorrect, send 400 error back //
    if (!validateNote(req.body)) {
        res.status(400).send('Note must have a title.');
    }
    
    //add note to JSON file and notes array in this function //
    const note = createNewNote(req.body, notes);

    res.json(note);
});

app.delete('/api/notes/:id', (req, res) => {
    letId = [req.params.id];
    delete projects[id];
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});