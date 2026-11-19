import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['text', 'single_choice', 'multiple_choice', 'skill'],
        required: true
    },
    options: {
        type: [String],
        default: []
    },
    required: {
        type: Boolean,
        default: false
    }
}, { _id: true })

const surveyModel = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    questions: {
        type: [questionSchema],
        default: []
    },
    deadline: {
        type: Date,
        default: null
    },
    anonymous: {
        type: Boolean,
        default: false
    },
    recipients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['draft', 'published', 'closed'],
        default: 'draft'
    },
    publishedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true })

export default mongoose.model('Survey', surveyModel)
