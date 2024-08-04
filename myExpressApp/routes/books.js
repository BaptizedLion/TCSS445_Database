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

//get for advancedFind
router.get("/advancedFind", function (req, res, next) {
  res.render("advancedFind", { title: "Find a Book" });
});

//search route for findBook
router.get("/search", function (req, res, next) {
  const { title, author, genre, minPrice, maxPrice } = req.query;

  let sql = `
    SELECT 
      ISBN as isbn, 
      TITLE as title, 
      AUTHORID as authorId, 
      PUBYEAR as pubYear, 
      PUBLISHER as publisher, 
      GENRE as genre, 
      BOOKCOST as bookCost 
    FROM books 
    WHERE 1=1
  `;
  const values = [];

  if (title) {
    sql += ` AND LOWER(TITLE) LIKE LOWER(?)`;
    values.push(`%${title}%`);
  }

  if (author) {
    sql += ` AND AUTHORID IN (SELECT id FROM authors WHERE LOWER(name) LIKE LOWER(?))`;
    values.push(`%${author}%`);
  }

  if (genre) {
    sql += ` AND LOWER(GENRE) = LOWER(?)`;
    values.push(genre);
  }

  if (minPrice) {
    sql += ` AND BOOKCOST >= ?`;
    values.push(parseFloat(minPrice));
  }

  if (maxPrice) {
    sql += ` AND BOOKCOST <= ?`;
    values.push(parseFloat(maxPrice));
  }

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res
        .status(500)
        .send("An error occurred while executing the query.");
    }
    console.log("Query Results:", results);
    res.render("searchResults", {
      title: "Search Results",
      query: { title, author, genre, minPrice, maxPrice },
      isAdvancedSearch: false, // or false for basic search
      results: results,
    });
  });
});

//search route for advancedFind

router.get("/searchAdvanced", function (req, res, next) {
  const { title, author, genre, minPrice, maxPrice } = req.query;

  let sql = `
    SELECT 
      b.ISBN as isbn, 
      b.TITLE as title, 
      b.AUTHORID as authorId,
      CONCAT(a.FIRSTNAME, ' ', a.LASTNAME) as authorName, 
      b.PUBYEAR as pubYear, 
      b.PUBLISHER as publisher, 
      b.GENRE as genre, 
      b.BOOKCOST as bookCost 
    FROM books b
    LEFT JOIN author a ON b.AUTHORID = a.AUTHORID
    WHERE 1=1
  `;
  const values = [];

  if (title) {
    sql += ` AND LOWER(b.TITLE) LIKE LOWER(?)`;
    values.push(`%${title}%`);
  }

  if (author) {
    sql += ` AND (LOWER(a.FIRSTNAME) LIKE LOWER(?) OR LOWER(a.LASTNAME) LIKE LOWER(?) OR LOWER(CONCAT(a.FIRSTNAME, ' ', a.LASTNAME)) LIKE LOWER(?))`;
    values.push(`%${author}%`, `%${author}%`, `%${author}%`);
  }

  if (genre) {
    sql += ` AND LOWER(b.GENRE) = LOWER(?)`;
    values.push(genre);
  }

  if (minPrice) {
    sql += ` AND b.BOOKCOST >= ?`;
    values.push(parseFloat(minPrice));
  }

  if (maxPrice) {
    sql += ` AND b.BOOKCOST <= ?`;
    values.push(parseFloat(maxPrice));
  }

  console.log("Search parameters:", {
    title,
    author,
    genre,
    minPrice,
    maxPrice,
  });
  console.log("SQL Query:", sql);
  console.log("SQL Values:", values);

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).render("error", {
        message: "An error occurred while executing the query.",
        error: {
          status: 500,
          stack: process.env.NODE_ENV === "development" ? err.stack : "",
        },
      });
    }
    console.log("Query Results:", results);
    res.render("searchResults", {
      title: "Advanced Search Results",
      query: { title, author, genre, minPrice, maxPrice },
      isAdvancedSearch: true,
      results: results,
    });
  });
});

module.exports = router;
