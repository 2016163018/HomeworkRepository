const express = require('express');
const sqlite3 = require('sqlite3');
const router = express.Router();

const db = new sqlite3.Database('./db/product.db');

router.get('/', function (req, res) {
  const category = req.query.category;
  const keyword = req.query.keyword || "";

  const where = `${`WHERE product_title LIKE "%${keyword}%"` || "" }${category && `AND product_category="${category}"` || ""}`
  const query = 'SELECT * FROM product ' + where

  db.all(query, (err, rows) => {
    console.log(err);
    res.render('index', {items:rows, category, keyword});
  })
});

router.get('/login', function(_, res) {
  res.render('login');
});

router.get('/signup', function(_, res) {
  res.render('signup');
});

module.exports = router;
