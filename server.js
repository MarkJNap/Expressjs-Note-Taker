const express = require('express');
const path = require('path');
const fs = require("fs");
// To create unique IDs
const { v4: uuidv4 } = require('uuid');

var dbData = require('./db/db.json');

const PORT = process.env.port || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

// GET Route for notes page
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// GET Route for retrieving all the saved note
app.get("/api/notes", (req, res) => res.json(dbData));

// GET Route for always redirecting to index homepage
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
})

// POST Route for adding a new note
app.post("/api/notes", (req, res) => {
    const newNote = req.body;
    // Makes sure the note is not empty
    if (!newNote.title || !newNote.text) {
        return res.status(400).json({ message: "Please enter a title and text" });
    } else {
        // Adding an id to the new note using the uuid module limited to 16 characters
        newNote.id = uuidv4().slice(0, 16);
        dbData.push(newNote);
        // The JSON.stringify(dbData, null, 2)) specifically the null and 2 are needed 
        // To get the correct formatting of the object in the db.json file
        fs.writeFileSync("./db/db.json", JSON.stringify(dbData, null, 2));
        console.log("\nA note with the title:\n'" + newNote.title + "'\nHas been successfully added!");
        res.json(newNote);
    }
});

// Delete Route for deleting a specific note from its unique id
app.delete("/api/notes/:id", (req, res) => {
    let id = req.params.id;
    // Filters out the note with the specific id and keeps the rest of the notes
    dbData = dbData.filter(note => note.id !== id);
    fs.writeFileSync("./db/db.json", JSON.stringify(dbData, null, 2));
    console.log("\nA note with the id:\n'" + id + "'\nHas been successfully deleted!");
    res.json(dbData);
});

app.listen(PORT, () =>
    console.log(`App listening at PORT: ${PORT}`)
);