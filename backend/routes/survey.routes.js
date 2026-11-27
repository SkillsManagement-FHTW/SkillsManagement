import express from 'express'
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware.js'
import roleEnum from '../models/enums/role.enum.js'
import {
    getAllSurveys,
    getSurveyById,
    createSurvey,
    updateSurvey,
    deleteSurvey,
    publishSurvey
} from '../controllers/survey.controller.js'

const router = express.Router()
const managersOnly = authorizeRole([roleEnum.ADMIN, roleEnum.COMPETENCE_LEADER])

router.use(authenticateToken, managersOnly)
router.get('/', getAllSurveys)
router.get('/:id', getSurveyById)
router.post('/', createSurvey)
router.put('/:id', updateSurvey)
router.delete('/:id', deleteSurvey)
router.post('/:id/publish', publishSurvey)

export default router
