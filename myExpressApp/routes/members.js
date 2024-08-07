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

// Route to handle search query for members who have books checked out
router.get("/searchMembers", function (req, res, next) {
  const { memberid, fname, lname, isbn, title, duedate } = req.query;
  let sql = `
    SELECT librarymembers.memberid, fname, lname, bookcheckouts.isbn, books.title, duedate
    FROM librarymembers
    JOIN bookcheckouts USING (memberid)
    JOIN books ON bookcheckouts.isbn = books.isbn
    WHERE 1=1
  `;
  const values = [];

  if (duedate) {
    sql += ` AND DUEDATE > ?`;
    values.push(duedate);
  }
  if (memberid) {
    sql += ` AND LOWER(librarymembers.memberid) LIKE LOWER(?)`;
    values.push(`%${memberid}%`);
  }
  if (fname) {
    sql += ` AND LOWER(fname) LIKE LOWER(?)`;
    values.push(`%${fname}%`);
  }
  if (lname) {
    sql += ` AND LOWER(lname) LIKE LOWER(?)`;
    values.push(`%${lname}%`);
  }
  if (isbn) {
    sql += ` AND LOWER(bookcheckouts.isbn) LIKE LOWER(?)`;
    values.push(`%${isbn}%`);
  }
  if (title) {
    sql += ` AND LOWER(books.title) LIKE LOWER(?)`;
    values.push(`%${title}%`);
  }

  console.log("SQL Query:", sql);
  console.log("Values:", values);

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res
        .status(500)
        .send("An error occurred while executing the query.");
    }
    console.log("Query Results:", results);
    res.render("memberResults", {
      title: "Member Search Results",
      query: req.query,
      results: results,
    });
  });
});

module.exports = router;
