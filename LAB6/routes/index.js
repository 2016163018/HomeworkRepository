var express = require('express');
var router = express.Router();

router.get('/', function(_, res) {
  res.render('index');
});

router.get('/login', function(_, res) {
  res.render('login');
});

router.get('/signup', function(_, res) {
  res.render('signup');
});

module.exports = router;
