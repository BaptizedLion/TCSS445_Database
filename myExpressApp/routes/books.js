const express = require("express");
const router = express.Router();
const connection = require("../db"); // Assuming you have your database connection set up

router.get("/add", (req, res) => {
  connection.query("SELECT id, name FROM authors", (err, authors) => {
    if (err) {
      console.error("Error fetching authors:", err);
      return res
        .status(500)
        .render("error", { message: "Internal Server Error" });
    }

    res.render("add_book", {
      title: "Add New Book",
      authors: authors, // Make sure this line is present
    });
  });
});

// POST route for handling form submission
router.post("/add", (req, res) => {
  const { title, author_id, description } = req.body;

  const query =
    "INSERT INTO books (title, author_id, description) VALUES (?, ?, ?)";
  connection.query(query, [title, author_id, description], (err, result) => {
    if (err) {
      console.error("Error adding book:", err);
      return res.status(500).render("error", { message: "Error adding book" });
    }
    res.redirect("/books"); // Redirect to book list or wherever appropriate
  });
});

module.exports = router;
