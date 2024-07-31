const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const articles = [
        {
          id: 1,
          title: "Book One",
          author: "Michael",
          body: "This is book one",
        },
        {
          id: 2,
          title: "Book Two",
          author: "Hamda",
          body: "This is book two",
        },
        {
          id: 3,
          title: "Book Three",
          author: "Simran",
          body: "This is book three",
        },
      ];
  console.error("Articles:", articles)
  res.render('index', { title: 'Library System', articles: articles });
});

module.exports = router;

