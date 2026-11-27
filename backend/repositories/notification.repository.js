import Notification from '../models/notification.model.js'

export const findNotificationsForUser = (userId) =>
    Notification.find({ recipient: userId }).sort({ createdAt: -1 })

export const markNotificationAsRead = (notificationId, userId) =>
    Notification.findOneAndUpdate(
        { _id: notificationId, recipient: userId },
        { status: 'read' },
        { new: true }
    )

export const createNotification = (notificationData) =>
    new Notification(notificationData).save()
