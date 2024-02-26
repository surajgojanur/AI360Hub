// models/FormData.js
const mongoose = require('mongoose');

const formDataSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const FormData = mongoose.model('FormData', formDataSchema);

module.exports = FormData;
