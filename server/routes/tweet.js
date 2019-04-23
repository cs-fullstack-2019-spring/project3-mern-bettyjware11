// Express and router allows you to use router.get/post/etc
var express = require('express');
var router = express.Router();
// You can name this anything. It's grabbing your model to allow you to use Mongoose database functions like find and create
var UserTwitterCollection = require('../models/UserTwitterSchema');

//this route displays trending tweets in the database
router.get('/listTrendingTweets', (req, res) => {
    //empty curly braces used to grab all info in model
    UserTwitterCollection.find({}, (errors, results) => {
        if (errors) res.send(errors);
        else res.send(results);
    });
});

/* Go to the root ('/') of this router group (tweets) and using GET. In the client you'll have to fetch '/tweets' with the default GET request */
router.get('/', function(req, res, next) {

    // We're calling our schema variable so we can use .find. There's no collection in here so it'll ask for everything in the database
    UserTwitterCollection.find((errors, results)=>{
        // If there was some sort of error in finding something, run this error
        if(errors) res.send(errors);
        // If everything went alright, send the results of the find function (all entries in the database)
        else res.send(results);
    });
});

/* Go to the root ('/') of this router group (tweets) and using POST. In the client you'll have to fetch '/tweets' with the POST method */
router.post('/', function(req, res, next) {
    // We're calling our schema variable so we can use .create function. You can use req.body if all of the information in your body of your fetch in React as the EXACT same names as your schema in your database. Otherwise you should use a collection here.
    UserTwitterCollection.create(req.body, (errors, results)=>{
        // If there was some sort of error in finding something, run this error
        if(errors) res.send(errors);
        // If everything went alright, send the new collection through the results variable
        else res.send("Added!!!!");
    });
});

router.get('/edit/:id', (req, res)=>{
    UserTwitterCollection.findOne({_id: req.params.id}, (errors, results)=>{
        if (errors) res.send(errors);
        else res.send(results);
    })
});

router.put('/', (req, res)=>{
    UserTwitterCollection.updateOne({_id: req.body._id},
        req.body, (errors)=>{
            if (errors) res.send(errors);
            else res.send("Updated!!!");
        });
});

// Allow you to call this movie group route in your app.js file.
module.exports = router;
