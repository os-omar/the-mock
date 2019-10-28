const mongoose = require('mongoose');


const ResourceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    pathId: { type: mongoose.Schema.Types.ObjectId, ref: 'Path', required: true },
    method: { type: String, required: true },
    headers: { type: Object },
    reqBody: { type: String },
    resBody: { type: Object },
    success: { type: Object },
    error: { type: Object }
});

module.exports = mongoose.model('Resource', ResourceSchema);