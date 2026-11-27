import express from 'express'
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware.js'
import roleEnum from '../models/enums/role.enum.js'
import {
    getNotificationsForCurrentUser,
    markNotificationAsRead
} from '../controllers/notification.controller.js'

const router = express.Router()
const lecturerOnly = authorizeRole([roleEnum.LECTURER])

router.get('/', authenticateToken, lecturerOnly, getNotificationsForCurrentUser)
router.patch('/:id/read', authenticateToken, lecturerOnly, markNotificationAsRead)

export default router
