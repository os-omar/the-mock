const mongoose = require('mongoose');

const pathSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    path: { type: String,  required: true }
});

module.exports = mongoose.model('Path', pathSchema);