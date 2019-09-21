const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create scheema

const AppSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    author:{
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

module.export = mongoose.model('app', AppSchema);  