var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TwitterUserSchema = new Schema(
    {
        username: {type: String, required: true, max: 100},
        password: {type: String, required: true, max: 100},
        // You need brackets around a type to make it an array
        tweet: [{
            title : String,
            author : String,
            message: String,
            optionalImageURL: String,
            privateTweetCheckbox: Boolean
        }]
    }
);

//Export model
module.exports = mongoose.model('userTwitter', TwitterUserSchema);
