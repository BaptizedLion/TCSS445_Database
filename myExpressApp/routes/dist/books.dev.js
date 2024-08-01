"use strict";

var express = require("express");

var router = express.Router();

var connection = require("../db"); // Assuming you have your database connection set up


router.get("/add", function (req, res) {
  connection.query("SELECT id, name FROM authors", function (err, authors) {
    if (err) {
      console.error("Error fetching authors:", err);
      return res.status(500).render("error", {
        message: "Internal Server Error"
      });
    }

    res.render("add_book", {
      title: "Add New Book",
      authors: authors // Make sure this line is present

    });
  });
}); // POST route for handling form submission

router.post("/add", function (req, res) {
  var _req$body = req.body,
      title = _req$body.title,
      author_id = _req$body.author_id,
      description = _req$body.description;
  var query = "INSERT INTO books (title, author_id, description) VALUES (?, ?, ?)";
  connection.query(query, [title, author_id, description], function (err, result) {
    if (err) {
      console.error("Error adding book:", err);
      return res.status(500).render("error", {
        message: "Error adding book"
      });
    }

    res.redirect("/books"); // Redirect to book list or wherever appropriate
  });
});
module.exports = router;