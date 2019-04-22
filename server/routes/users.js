var express = require('express');
var router = express.Router();
var bCrypt = require('bcrypt-nodejs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var twitteruserCollection = require('../models/TwitterUserSchema');

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    userCollection.findById(id, function(err, user) {
        done(err, user);
    });
});

var isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
};

var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

router.get('/', (req, res, next) => {
    console.log("Home page");
    console.log(req.session);
    console.log(req.session.username);

    if (req.session.username) {
        res.send(req.session.username);
    } else {
        res.send(null);
    }
});


router.get('/logout', (req, res, next) => {
    console.log(req.session);
    // console.log(req.session.username);

    if (req.session) {
        console.log("has session");
        req.session=null;
        res.send("Logged Out");
    } else {
        console.log("Doesn't have session");
        res.send("Not logged in");
    }
});

// This is the "strategy" for checking for an existing twitteruser
passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log("Local Strategy");
        twitteruserCollection.findOne({ username: username }, function (err, twitteruser) {
            if (err) { console.log("1");
                return done(err); }
            if (!user) {
                console.log("2");
                return done(null, false, { message: 'Incorrect username.' });
            }
            // if (!user.validPassword(password)) {
            if (!isValidPassword(user, password)) {
                console.log("3");
                return done(null, false, { message: 'Incorrect password.' });
            }
            console.log("4");
            console.log(twitteruser);
            return done(null, twitteruser, { user: twitteruser.username });
        });
    }
));

// This is the route to check for new twitterusers
router.post('/login',
    passport.authenticate('local',
        {failureRedirect: '/twitterusers/loginfail' }),
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.

    function(req, res) {
        // console.log(req.body.user);
        req.session.username=req.body.username;
        console.log("Saving cookie");
        res.send(req.body.username);
    });

// **** I'm not running this right now because I want to use the user data
// If there is a successful check of an existing user
router.get('/loginsuccess', (req, res)=>{
    res.send("Successful Logging in!!!")
});

// If there is a failure check of an existing user
router.get('/loginfail', (req, res)=>{
    res.send(undefined)
});
// This is the "strategy" for signing up a new user.
// The first parameter is the name to call this strategy. New local strategy is referencing passport-local that was required earlier.
passport.use('signup', new LocalStrategy(
    // Allows you to use the req.body of the route that called the strategy
    {passReqToCallback : true},
    // req is the request of the route that called the strategy
    // username and password are passed by passport by default
    // done is the function to end the strategy (callback function).
    function(req, username, password, done) {
        console.log("0");
        // Created like this so it can be delayed to be run in the next "tick" loop. See function call below.
        findOrCreateUser = function(){
            // find a user in Mongo with provided username. It returns an error if there is an error or the full entry for that user
            twitteruserCollection.findOne({'username':username},function(err, user) {
                // In case of any error in Mongoose/Mongo when finding the user
                if (err){
                    console.log('Error in SignUp: '+err);
                    // Return the error in the callback function done
                    return done(err);
                }
                // if the user already exists
                if (twitteruser) {
                    console.log('Twitter User already exists');
                    // null because there's no error
                    // false because there was a failure
                    // Send the failure message detailing the failure
                    return done(null, false,
                        { message: 'Twitter User already exists.' }
                    );
                } else {
                    console.log(req.body);
                    // if there is no user with that username
                    // create the user
                    var newTwitterUser = new twitteruserCollection();
                    // set the user's local credentials
                    newTwitterUser.username = req.body.username;
                    newTwitterUser.password = createHash(req.body.password);
                    newTwitterUser.email = req.body.email;


                    // save the twitteruser. Works like .create, but for an object of a schema
                    newTwitterUser.save(function(err) {
                        // If there is an error
                        if (err){
                            console.log('Error in Saving user: '+err);
                            // Throw error to catch in the client
                            throw err;
                        }
                        console.log('User Registration succesful');
                        // Null is returned because there was no error
                        // newUser is returned in case the route that called this strategy (callback route) needs any of it's info.
                        return done(null, newTwitterUser);
                    });
                }
            });
        };
        // Delay the execution of findOrCreateUser and execute
        // the method in the next tick of the event loop
        process.nextTick(findOrCreateUser);
    })
);

// Create new user with the signup strategy
router.post('/newtwitteruser',
    // Passport's authenticate function is called the signup strategy. Once it's complete it's either successful or failed
    passport.authenticate('signup',
        { successRedirect: '/twitterusers/successNewUser',
            // If the signup strategy fails, redirect to the /users/failNewUser route
            failureRedirect: '/twitterusers/failNewUser'}
    ),
    // If the signup strategy is successful, send "User Created!!!"
    function(req, res) {
        console.log("test");
        // Send the message in the .send function
        res.send('Authenticated!!!');
    });

// If there is a successful new user
router.get('/successNewUser', (req, res)=>{
    console.log(req.body);
    res.send("Added New User")
});


// If a new user signup strategy failed, it's redirected to this route
router.get('/failNewUser', (req, res)=>{
    res.send('NOPE!!! On the new user');
});


// This route looks for a user saved in the cookie data and find that user in your database. It returns the entire results of that user to the client. The results include the to-do list ARRAY.
router.get('/grabTwitterUser', (req, res)=>{
    // finds one user name from the cookie (session) data
    twitteruserCollection.findOne({username: req.session.username}, (errors, results)=>{
        // If there are returned results from finding a user, the results are returned to the client (res.send)
        if(results){ return res.send(results); }
        // If there is an error, send an error message to the client
        else{return res.send({message: "Didn't find a user!!!"})}
    })
});

// This is from fetch '/twitterusers/addTweet' run from the client side as a post.
router.post('/addTweet', (req,res)=>{
    // Find the twitteruser sent in the req.body. Push ($push) the req.body.todoItem into the _todo (ignore the underscore) key to add to the existing array in _todo.
    twitteruserCollection.findOneAndUpdate({username: req.body.username},
        {$push: {tweet: req.body.tweet}}, (errors, results)=>{
            // If there was an error send the error
            if(errors) res.send(errors);
            // If it went through send "ADDED!!!"
            else res.send("ADDED!!!");
        });
});


module.exports = router;

