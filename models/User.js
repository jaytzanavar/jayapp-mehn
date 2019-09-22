const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create scheema

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

module.export = mongoose.model('users', UserSchema);  