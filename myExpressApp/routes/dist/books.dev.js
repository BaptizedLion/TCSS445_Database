"use strict";

var express = require("express");

var router = express.Router();

var mysql = require("mysql");

var app = express();
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "library_test2"
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
      authors: authors,
      success: req.query.success
    });
  });
}); // // POST route for handling form submission

router.post("/add", function (req, res) {
  var _req$body = req.body,
      isbn = _req$body.isbn,
      title = _req$body.title,
      authorid = _req$body.authorid,
      pubyear = _req$body.pubyear,
      publisher = _req$body.publisher,
      genre = _req$body.genre,
      bookcost = _req$body.bookcost,
      rating = _req$body.rating; // const coverUrl = await fetchBookCover(isbn);

  console.log("Received author ID:", authorid); // First, check if the author exists

  connection.query("SELECT * FROM author WHERE authorid = ?", [authorid], function (err, results) {
    if (err) {
      console.error("Error checking author:", err);
      return res.status(500).render("error", {
        message: "Error checking author"
      });
    }

    if (results.length === 0) {
      return res.status(400).render("error", {
        message: "Invalid author ID. Author does not exist."
      });
    } // If author exists, proceed with book insertion


    var query = "INSERT INTO books (isbn, title, authorid, pubyear, publisher, genre, bookcost, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    connection.query(query, [isbn, title, authorid, pubyear, publisher, genre, bookcost, rating], function (err, result) {
      if (err) {
        console.error("Error adding book:", err);
        return res.status(500).render("error", {
          message: "Error adding book"
        });
      }

      res.redirect("/books/add?success=true"); // Redirect to book list
    });
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
}); //get for advancedFind

router.get("/advancedFind", function (req, res, next) {
  res.render("advancedFind", {
    title: "Find a Book"
  });
}); //search route for findBook

router.get("/search", function (req, res, next) {
  var _req$query = req.query,
      title = _req$query.title,
      author = _req$query.author,
      genre = _req$query.genre,
      minPrice = _req$query.minPrice,
      maxPrice = _req$query.maxPrice,
      rating = _req$query.rating;
  var sql = "\n    SELECT \n      ISBN as isbn, \n      TITLE as title, \n      AUTHORID as authorId, \n      PUBYEAR as pubYear, \n      PUBLISHER as publisher, \n      GENRE as genre, \n      BOOKCOST as bookCost,\n      RATING as rating \n    FROM books \n    WHERE 1=1\n  ";
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

  if (rating) {
    sql += " AND RATING >= ?";
    values.push(rating);
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
      isAdvancedSearch: false,
      // or false for basic search
      results: results
    });
  });
}); //search route for advancedFind

router.get("/searchAdvanced", function (req, res, next) {
  var _req$query2 = req.query,
      title = _req$query2.title,
      author = _req$query2.author,
      genre = _req$query2.genre,
      minPrice = _req$query2.minPrice,
      maxPrice = _req$query2.maxPrice,
      rating = _req$query2.rating;
  var sql = "\n    SELECT \n      b.ISBN as isbn, \n      b.TITLE as title, \n      b.AUTHORID as authorId,\n      CONCAT(a.FIRSTNAME, ' ', a.LASTNAME) as authorName, \n      b.PUBYEAR as pubYear, \n      b.PUBLISHER as publisher, \n      b.GENRE as genre, \n      b.BOOKCOST as bookCost,\n      b.RATING as rating \n    FROM books b\n    LEFT JOIN author a ON b.AUTHORID = a.AUTHORID\n    WHERE 1=1\n  ";
  var values = [];

  if (title) {
    sql += " AND LOWER(b.TITLE) LIKE LOWER(?)";
    values.push("%".concat(title, "%"));
  }

  if (author) {
    sql += " AND (LOWER(a.FIRSTNAME) LIKE LOWER(?) OR LOWER(a.LASTNAME) LIKE LOWER(?) OR LOWER(CONCAT(a.FIRSTNAME, ' ', a.LASTNAME)) LIKE LOWER(?))";
    values.push("%".concat(author, "%"), "%".concat(author, "%"), "%".concat(author, "%"));
  }

  if (genre) {
    sql += " AND LOWER(b.GENRE) = LOWER(?)";
    values.push(genre);
  }

  if (minPrice) {
    sql += " AND b.BOOKCOST >= ?";
    values.push(parseFloat(minPrice));
  }

  if (maxPrice) {
    sql += " AND b.BOOKCOST <= ?";
    values.push(parseFloat(maxPrice));
  }

  if (rating) {
    sql += " AND b.RATING >= ?";
    values.push(rating);
  }

  console.log("Search parameters:", {
    title: title,
    author: author,
    genre: genre,
    minPrice: minPrice,
    maxPrice: maxPrice,
    rating: rating
  });
  console.log("SQL Query:", sql);
  console.log("SQL Values:", values);
  connection.query(sql, values, function (err, results) {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).render("error", {
        message: "An error occurred while executing the query.",
        error: {
          status: 500,
          stack: process.env.NODE_ENV === "development" ? err.stack : ""
        }
      });
    }

    console.log("Query Results:", results);
    res.render("searchResults", {
      title: "Advanced Search Results",
      query: {
        title: title,
        author: author,
        genre: genre,
        minPrice: minPrice,
        maxPrice: maxPrice
      },
      isAdvancedSearch: true,
      results: results
    });
  });
});
module.exports = router;