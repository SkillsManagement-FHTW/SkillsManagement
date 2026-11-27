import mongoose from 'mongoose'
import * as notificationService from '../services/notification.service.js'

export const getNotificationsForCurrentUser = async (req, res) => {
    try {
        const notifications = await notificationService.getNotificationsForUser(req.user.id)
        res.status(200).json(notifications)
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch notifications', error: error.message })
    }
}

export const markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid notification ID' })
        }

        const notification = await notificationService.markNotificationAsRead(id, req.user.id)

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' })
        }

        res.status(200).json(notification)
    } catch (error) {
        res.status(500).json({ message: 'Failed to mark notification as read', error: error.message })
    }
}
