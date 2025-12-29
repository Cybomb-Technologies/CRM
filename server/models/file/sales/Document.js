const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    originalName: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true // Uncomment if User model and auth are fully integrated
    },
    category: {
        type: String,
        default: 'general'
    },
    tags: [String],
    description: String,
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

module.exports = mongoose.model('Document', documentSchema);
