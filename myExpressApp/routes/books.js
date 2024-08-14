const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const app = express();
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "library_test2",
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
      success: req.query.success,
    });
  });
});

// // POST route for handling form submission
router.post("/add", (req, res) => {
  const { isbn, title, authorid, pubyear, publisher, genre, bookcost, rating } =
    req.body;

  // const coverUrl = await fetchBookCover(isbn);

  console.log("Received author ID:", authorid);
  // First, check if the author exists
  connection.query(
    "SELECT * FROM author WHERE authorid = ?",
    [authorid],
    (err, results) => {
      if (err) {
        console.error("Error checking author:", err);
        return res
          .status(500)
          .render("error", { message: "Error checking author" });
      }

      if (results.length === 0) {
        return res.status(400).render("error", {
          message: "Invalid author ID. Author does not exist.",
        });
      }

      // If author exists, proceed with book insertion
      const query =
        "INSERT INTO books (isbn, title, authorid, pubyear, publisher, genre, bookcost, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

      connection.query(
        query,
        [isbn, title, authorid, pubyear, publisher, genre, bookcost, rating],
        (err, result) => {
          if (err) {
            console.error("Error adding book:", err);
            return res
              .status(500)
              .render("error", { message: "Error adding book" });
          }
          res.redirect("/books/add?success=true"); // Redirect to book list
        }
      );
    }
  );
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
  const { title, author, genre, minPrice, maxPrice, rating } = req.query;

  let sql = `
    SELECT 
      ISBN as isbn, 
      TITLE as title, 
      AUTHORID as authorId, 
      PUBYEAR as pubYear, 
      PUBLISHER as publisher, 
      GENRE as genre, 
      BOOKCOST as bookCost,
      RATING as rating 
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

  if (rating) {
    sql += ` AND RATING >= ?`;
    values.push(rating);
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
  const { title, author, genre, minPrice, maxPrice, rating } = req.query;

  let sql = `
    SELECT 
      b.ISBN as isbn, 
      b.TITLE as title, 
      b.AUTHORID as authorId,
      CONCAT(a.FIRSTNAME, ' ', a.LASTNAME) as authorName, 
      b.PUBYEAR as pubYear, 
      b.PUBLISHER as publisher, 
      b.GENRE as genre, 
      b.BOOKCOST as bookCost,
      b.RATING as rating 
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

  if (rating) {
    sql += ` AND b.RATING >= ?`;
    values.push(rating);
  }

  console.log("Search parameters:", {
    title,
    author,
    genre,
    minPrice,
    maxPrice,
    rating,
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
