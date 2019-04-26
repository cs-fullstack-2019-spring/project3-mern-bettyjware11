var express = require('express');
var router = express.Router();
var TwitterUserCollection = require('../models/TwitterUserSchema');

// Used to hash passwords
var bCrypt = require('bcrypt-nodejs');

// Middleware for authentication. Run at the start of a route that uses a strategy
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Initialize passport and restore cookie data
router.use(passport.initialize());
router.use(passport.session());

//Serialization and Deserialization: In order to restore authentication state across HTTP requests, Passport needs to serialize users into and deserialize users out of the session. Serialization is the process of turning an object in memory into a stream of bytes so you can do stuff send it the database. Deserialization is the reverse process of serialization.
passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    TwitterUserCollection.findById(id, function(err, user) {
        done(err, user);
    });
});

// Validation for password. The password in the function is what the user enterd. The user.password is the saved password. It's run when someone needs to log in and check if the password they entered is the same as the one in the database.
var isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
};

// Password scrambler (randomizes it)
var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

// This is the "strategy" for signing up a new user.
// The first parameter is the name to call this strategy. New local strategy is referencing passport-local that was required earlier.
passport.use('signUp', new LocalStrategy(
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
            TwitterUserCollection.findOne({'username':username},function(err, user) {
                // In case of any error in Mongoose/Mongo when finding the user

                // if the user already exists
                if (user) {
                    console.log('User already exists');
                    // null because there's no error
                    // false because there was a failure
                    // Send the failure message detailing the failure
                    return done(null, false,
                        { message: 'User already exists.' }
                    );
                } else {
                    console.log(req.body);
                    // if there is no user with that email
                    // create the user
                    var newUser = new TwitterUserCollection();
                    // set the user's local credentials
                    newUser.username = req.body.username;
                    newUser.password = createHash(req.body.password);
                    newUser.image = req.body.image;
                    newUser.backgroundImage = req.body.backgroundImage;

                    // save the user. Works like .create, but for an object of a schema
                    newUser.save(function(err) {
                        // If there is an error
                        if (err){
                            console.log('Error in Saving user: '+err);
                            // Throw error to catch in the client
                            throw err;
                        }
                        console.log('User Registration succesful');
                        // Null is returned because there was no error
                        // newUser is returned in case the route that called this strategy (callback route) needs any of it's info.
                        return done(null, newUser);
                    });
                }
            });
        };
        // Delay the execution of findOrCreateUser and execute
        // the method in the next tick of the event loop
        process.nextTick(findOrCreateUser);
    })
);
router.post('/signUp',
    passport.authenticate('signUp',
        {failureRedirect: '/users/signUpfail'}
    ), (req, res) => {
        res.send(req.body.username)
    });
router.get('/signUpfail', (req, res) => {
    res.send("Sign Up failed. Please try again. ");
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        TwitterUserCollection.findOne({username: username}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {message: 'Username incorrect. Please Try again.'});
            }
            if (!isValidPassword(user, password)) {
                return done(null, false, {message: 'Password incorrect. Please try again.'});
            }
            return done(null, user, {user: user.username});
        });
    }
));



// If someone tries to login, run this route.
router.post('/login',
    // Passport's authenticate function called the local strategy. Once it's complete it's either successful or failed
    passport.authenticate('local',
        // If the signup strategy fails, redirect to the /users/failNewUser route
        {failureRedirect: '/users/loginfail' }),

    // If this function gets called, authentication was successful.
    function(req, res) {
        console.log(req.body);
        // Creates a new cookie (req.session) if it doesn't exist and assigns the request's body.username to the session's username attribute
        // req.user is the results from the findOne function of local strategy
        req.session.username=req.body.username;
        // Send the username and tweet back to the client to save to the client's state
        res.send(req.session.username);
    });


router.get('/loginFail', (req, res) => {
    res.send(undefined);
});

router.get('/logout', (req, res) => {
    req.session = null
});


router.get('/grabTweet', (req, res) => {
    TwitterUserCollection.find({}, (errors, results) => {
        if (errors) res.send(errors);
        else {
            res.send(results)
        }
    })
});







module.exports = router;
