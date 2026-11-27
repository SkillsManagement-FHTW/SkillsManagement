import mongoose from 'mongoose'

const notificationModel = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['survey', 'info'],
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['open', 'read', 'expired'],
        default: 'open'
    }
}, { timestamps: true })

export default mongoose.model('Notification', notificationModel)
