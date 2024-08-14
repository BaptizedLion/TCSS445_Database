const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "library_test2",
});

// GET route for displaying the add author form
router.get("/add", (req, res) => {
  res.render("authors/add", { success: req.query.success });
});

// POST route for adding a new author
router.post("/add", (req, res) => {
  const {
    firstName,
    lastName,
    authorID,
    dateOfBirth,
    phoneNumber,
    booksWritten,
  } = req.body;
  const query =
    "INSERT INTO author (firstName, lastName, authorID, dateOfBirth, phoneNumber, booksWritten) VALUES (?, ?, ?, ?, ?, ?)";
  connection.query(
    query,
    [firstName, lastName, authorID, dateOfBirth, phoneNumber, booksWritten],
    (err, result) => {
      if (err) {
        console.error("Error adding author:", err);
        return res
          .status(500)
          .render("authors/add", { error: "Error adding author" });
      }
      res.redirect("/authors/add?success=true"); // Redirect back to the add form with success parameter
    }
  );
});

// GET route
router.get("/", (req, res) => {
  const query = "SELECT * FROM author";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching authors:", err);
      return res
        .status(500)
        .render("error", { message: "Error fetching authors" });
    }
    res.render("authors/list", {
      authors: results,
      success: req.query.success,
    });
  });
});

module.exports = router;
