var express = require('express');
var router = express.Router();
var UserTwitterCollection = require("../models/UserTwitterSchema");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Project 3 Twitter Collection' });
});




module.exports = router;
