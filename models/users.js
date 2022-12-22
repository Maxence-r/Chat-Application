const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
    pseudo: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        index: true,
        unique: true,
        required: true,
        match: /.+\@.+\..+/
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: false
    }
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema);
module.exports = User;