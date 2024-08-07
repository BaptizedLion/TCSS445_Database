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
    SELECT memberid, fname, lname, isbn, duedate
    FROM librarymembers 
    JOIN bookcheckouts USING (memberid)
    WHERE DUEDATE > '2023-07-25'
  `;
  const values = [];

  if (memberid) {
    sql += ` AND LOWER(librarymembers.memberid) LIKE LOWER(?)`;
    values.push(`%${memberid}%`);
  }

  if (fname) {
    sql += ` AND LOWER(librarymembers.fname) LIKE LOWER(?)`;
    values.push(`%${fname}%`);
  }

  if (lname) {
    sql += ` AND LOWER(librarymembers.lname) LIKE LOWER(?)`;
    values.push(`%${lname}%`);
  }

  if (isbn) {
    sql += ` AND LOWER(bookcheckouts.isbn) LIKE LOWER(?)`;
    values.push(`%${isbn}%`);
  }

  if (title) {
    sql += ` AND LOWER(bookcheckouts.title) LIKE LOWER(?)`;
    values.push(`%${title}%`);
  }

  if (duedate) {
    sql += ` AND LOWER(bookcheckouts.duedate) LIKE LOWER(?)`;
    values.push(`%${duedate}%`);
  }

  // Log the final SQL query and values
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

    if (results.length === 0) {
      return res.send("No results found.");
    }

    res.render("memberResults", {
      title: "Member Results",
      query: req.query,
      results: results,
    });
  });
});



module.exports = router;
