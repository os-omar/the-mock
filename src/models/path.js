const mongoose = require('mongoose');

const pathSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    path: { type: String,  required: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('p', pathSchema);
