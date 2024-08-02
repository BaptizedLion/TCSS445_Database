const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const app = express();
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "library_test",
});

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
      authors: authors,
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
    res.redirect("/books"); // Redirect to book list
  });
});

//get for findBook
router.get("/find", function (req, res, next) {
  res.render("findBook", { title: "Find a Book" });
});

// add route
app.get("/books/add", function (req, res) {
  res.render("add_book", {
    title: "Add Book",
  });
});

//search route for findBook
router.get("/search", function (req, res, next) {
  const query = req.query.query;
  // Here you would typically search your database
  // For now, we'll just send back the query
  res.render("searchResults", {
    title: "Search Results",
    query: query,
    results: [],
  });
});
module.exports = router;
