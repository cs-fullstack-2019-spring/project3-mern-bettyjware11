var express = require('express');
var router = express.Router();
var TwitterUserCollection = require("../models/TwitterUserSchema");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Project 3 Twitter Collection' });
});




module.exports = router;
