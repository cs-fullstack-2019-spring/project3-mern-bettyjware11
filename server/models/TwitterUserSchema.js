var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;


var Schema = mongoose.Schema;

var TwitterUserSchema = new Schema(
    {
        username: {type: String, required: true, max: 100},
        password: {type: String, required: true, max: 100},
        image: String,
        backgroundImage: String,
        // You need brackets around a type to make it an array
        tweet:
         [{
            title: String,
            message: String,
            optionalImageURL: String,
            privateTweetCheckbox: Boolean
        }]
    }
);

//Export model
module.exports = mongoose.model('tweet', TwitterUserSchema);
