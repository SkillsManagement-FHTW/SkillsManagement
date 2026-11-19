import * as notificationRepository from '../repositories/notification.repository.js'

export const getNotificationsForUser = async (userId) =>
    notificationRepository.findNotificationsForUser(userId)

export const markNotificationAsRead = async (notificationId, userId) =>
    notificationRepository.markNotificationAsRead(notificationId, userId)

// Used later by survey and information sending workflows.
export const createNotification = async (notificationData) =>
    notificationRepository.createNotification(notificationData)
