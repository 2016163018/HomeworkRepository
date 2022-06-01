const express = require("express");
const sqlite3 = require("sqlite3");
const fs = require('fs');
const path = require("path");

const router = express.Router();
const db = new sqlite3.Database("./db/product.db");
const commentPath = path.join(__dirname, '../comment.json');

router.get("/", function (req, res) {
  const category = req.query.category;
  const keyword = req.query.keyword || "";

  const where = `${`WHERE product_title LIKE "%${keyword}%"` || ""}${
    (category && `AND product_category="${category}"`) || ""
  }`;
  const query = "SELECT * FROM product " + where;

  db.all(query, (_, rows) => {
    res.render("index", { items: rows, category, keyword });
  });
});

router.get("/product/:product_id", function (req, res) {
  const id = req.params.product_id;
  const query = `SELECT * FROM product WHERE product_id=${id}`;
  const comments = JSON.parse(fs.readFileSync(commentPath));
  const filteredComments = comments.filter((comment) => comment.product_id === +id);

  db.get(query, (_, row) => {
    res.render("product", { product: row, comments:filteredComments });
  });
});

router.post("/comment", function (req, res) {
  const product_id = +req.headers.referer.split('/').pop();
  const content = req.body.comment;
  const comments = JSON.parse(fs.readFileSync(commentPath));

  comments.push({ product_id, content });
  fs.writeFileSync(commentPath, JSON.stringify(comments));
  console.log(comments);
  res.redirect(`/product/${product_id}`);
})

router.get("/login", function (_, res) {
  res.render("login");
});

router.get("/signup", function (_, res) {
  res.render("signup");
});

module.exports = router;
