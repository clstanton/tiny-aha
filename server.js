// write data to db.json
const fs = require('fs');
const path = require('path');

// route client will have to fetch from //
const {notes} = require('./data/db');

const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

/// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));

// parse incoming JSON data
app.use(express.json());

app.use(express.static('public'));


// takes id & array of notes and returns a single note object //
function findById(id, notesArray) {
    const result = notesArray.filter(note => note.id === id)[0];
    return result;
}

// Function to handle note creation //
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

function validateNote(note) {
    if (!note.title || typeof note.title !== 'string') {
        return false;
    }
    return true;
}

// argument 1. string that describes the route the client will have to fetch from //
// argument 2. callback function that will execute every time route is accessed with a get request //
app.get('/api/db', (req, res) => {
    let results = notes;
    if (req.query) {
        results = filterByQuery(req.query,results);
    }
    res.json(results);
});

app.get('/api/db/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

// endpoint that accepts data from the client to be stored on the server //
app.post('/api/db', (req, res) => {
    // req.body is where the incoming content will be //
    // set id based on what the next index of the array will be //
    req.body.id = notes.length.toString();

    // if any data in req.body is incorrect, send 400 error back //
    if (!validateNote(req.body)) {
        res.status(400).send('Note must have a title.');
    }
    
    //add note to JSON file and notes array in this function //
    const note = createNewNote(req.body, notes);

    res.json(note);
});

// get index.html to be served from express.js server //
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});