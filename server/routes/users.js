var express = require('express');
var router = express.Router();
var UserTwitterCollection = require('../models/UserTwitterSchema');

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
    UserTwitterCollection.findById(id, function(err, user) {
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

/* GET users listing. */
router.get('/', (req, res, next) => {
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
        req.session=null;
        res.send("Logged Out");
    } else {
        res.send("Not logged in");
    }
});
//******************************************************************
// ***************   Check if a user exists    *********************
//******************************************************************

// This is the "strategy" for checking for an existing user. If we don't assign a name to the strategy it defaults to local
passport.use(new LocalStrategy(
    // req is the request of the route that called the strategy
    // username and password are passed by passport by default
    // done is the function to end the strategy (callback function).
    function(username, password, done) {
        console.log("Local Strat");
        // find a user in Mongo with provided username. It returns an error if there is an error or the full entry for that user
        UserTwitterCollection.findOne({ username: username }, function (err, user) {
            // If there is a MongoDB/Mongoose error, send the error
            if (err) {console.log("1");
                return done(err); }
            // If there is not a user in the database, it's a failure and send the message below
            if (!user) {
                console.log("2");
                return done(null, false, { message: 'Incorrect username.' });
            }
            // Check to see if the password typed into the form and the user's saved password is the same.
            if (!isValidPassword(user, password)) {
                console.log("3");
                return done(null, false, { message: 'Incorrect password.' });
            }
            console.log("4");
            console.log(user);
            // null is here because there is not an error
            // user is the results of the findOne function
            return done(null, user, { user: user.username });
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
        res.send(req.body.username);
    });
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
            UserTwitterCollection.findOne({'username':username},function(err, user) {
                // In case of any error in Mongoose/Mongo when finding the user
                if (err){
                    console.log('Error in SignUp: '+err);
                    // Return the error in the callback function done
                    return done(err);
                }
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
                    var newUser = new UserTwitterCollection();
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

// This is the route to create a new user.
router.post('/newuser',
    passport.authenticate('signup',
        { successRedirect: '/users/successNewUser',
            failureRedirect: '/users/failNewUser'
        }
    ),
    function(req, res) {
        console.log("test");
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        res.send('Authenticated!');
    });

// If there is a successful new user
router.get('/successNewUser', (req, res)=>{
    console.log(req.body);
    res.send("Added New User")
});

// If there is a failer of a new user
router.get('/failNewUser', (req, res)=>{
    console.log("Failed New User");
});



module.exports = router;
