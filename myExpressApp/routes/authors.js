const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const mysql = require("mysql");
const app = express();
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "library_test",
});

// GET route for displaying all authors
router.get("/", async (req, res) => {
  try {
    const authors = await Author.find();
    res.render("authors/index", { authors: authors });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET route for displaying the add author form
router.get("/add", (req, res) => {
  res.render("authors/add");
});

// POST route for adding a new author
router.post("/add", async (req, res) => {
  const author = new Author({
    id: req.body.authorId,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    birthDate: req.body.birthDate,
  });

  try {
    const newAuthor = await author.save();
    res.redirect("/authors");
  } catch (err) {
    res.status(400).render("authors/add", {
      author: author,
      errorMessage: "Error creating Author",
    });
  }
});

// GET route for editing an author
router.get("/edit/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.render("authors/edit", { author: author });
  } catch (err) {
    res.redirect("/authors");
  }
});

// POST route for updating an author
router.post("/edit/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    author.firstName = req.body.firstName;
    author.lastName = req.body.lastName;
    author.birthDate = req.body.birthDate;
    await author.save();
    res.redirect("/authors");
  } catch (err) {
    if (author == null) {
      res.redirect("/authors");
    } else {
      res.render("authors/edit", {
        author: author,
        errorMessage: "Error updating Author",
      });
    }
  }
});

// DELETE route for removing an author
router.delete("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    await author.remove();
    res.redirect("/authors");
  } catch (err) {
    if (author == null) {
      res.redirect("/authors");
    } else {
      res.redirect("/authors");
    }
  }
});

module.exports = router;
