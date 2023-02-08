const express = require('express');
const path = require('path');
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

var dbData = require('./db/db.json');

const PORT = process.env.port || 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => res.json(dbData));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
})

app.post("/api/notes", (req, res) => {
    const newNote = req.body;
    if (!newNote.title ||!newNote.text) {
        return res.status(400).json({ message: "Please enter a title and text" });
    } else {
    newNote.id = uuidv4().slice(0, 16);
    dbData.push(newNote);
    fs.writeFileSync("./db/db.json", JSON.stringify(dbData, null, 2));
    console.log("A note with the title:\n'" + newNote.title + "'\nHas been successfully added!");
    res.json(newNote);
    }
});

app.delete("/api/notes/:id", (req, res) => {
    let id = req.params.id;
    dbData = dbData.filter(note => note.id!== id);
    fs.writeFileSync("./db/db.json", JSON.stringify(dbData, null, 2));
    console.log("A note with the id:\n'" + id + "'\nHas been successfully deleted!");
    res.json(dbData);
});

app.listen(PORT, () =>
  console.log(`App listening at PORT: ${PORT} 🚀`)
);
