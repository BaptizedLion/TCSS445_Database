"use strict";

var express = require("express");

var router = express.Router();

var mysql = require("mysql");

var app = express();
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "library_test"
});
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
      authors: authors
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

    res.redirect("/books"); // Redirect to book list
  });
}); //get for findBook

router.get("/find", function (req, res, next) {
  res.render("findBook", {
    title: "Find a Book"
  });
}); // add route

app.get("/books/add", function (req, res) {
  res.render("add_book", {
    title: "Add Book"
  });
}); //search route for findBook

router.get("/search", function (req, res, next) {
  var _req$query = req.query,
      title = _req$query.title,
      author = _req$query.author,
      genre = _req$query.genre,
      minPrice = _req$query.minPrice,
      maxPrice = _req$query.maxPrice;
  var sql = "\n    SELECT \n      ISBN as isbn, \n      TITLE as title, \n      AUTHORID as authorId, \n      PUBYEAR as pubYear, \n      PUBLISHER as publisher, \n      GENRE as genre, \n      BOOKCOST as bookCost \n    FROM books \n    WHERE 1=1\n  ";
  var values = [];

  if (title) {
    sql += " AND LOWER(TITLE) LIKE LOWER(?)";
    values.push("%".concat(title, "%"));
  }

  if (author) {
    sql += " AND AUTHORID IN (SELECT id FROM authors WHERE LOWER(name) LIKE LOWER(?))";
    values.push("%".concat(author, "%"));
  }

  if (genre) {
    sql += " AND LOWER(GENRE) = LOWER(?)";
    values.push(genre);
  }

  if (minPrice) {
    sql += " AND BOOKCOST >= ?";
    values.push(parseFloat(minPrice));
  }

  if (maxPrice) {
    sql += " AND BOOKCOST <= ?";
    values.push(parseFloat(maxPrice));
  }

  connection.query(sql, values, function (err, results) {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).send("An error occurred while executing the query.");
    }

    console.log("Query Results:", results);
    res.render("searchResults", {
      title: "Search Results",
      query: {
        title: title,
        author: author,
        genre: genre,
        minPrice: minPrice,
        maxPrice: maxPrice
      },
      results: results
    });
  });
});
module.exports = router;