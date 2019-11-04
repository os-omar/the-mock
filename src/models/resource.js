const mongoose = require('mongoose');


const ResourceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    pathId: { type: mongoose.Schema.Types.ObjectId, ref: 'p', required: true },
    method: { type: String, required: true },
    headers: { type: Object },
    reqBody: { type: String },
    resBody: { type: Object },
    success: { type: Object },
    error: { type: Object },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('r', ResourceSchema);
