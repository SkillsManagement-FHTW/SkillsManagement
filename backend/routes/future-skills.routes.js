import express from 'express';
const router = express.Router();

import {
    getAllFutureSkills,
    createFutureSkill,
    updateFutureSkill,
    deleteFutureSkill,
    sendFutureSkillMail
} from '../controllers/future.skills.controller.js';
import {getFutureSkillStatusEmail} from "../controllers/email.controller.js";
import {authenticateToken, authorizeRole} from "../middleware/auth.middleware.js";
import roleEnum from "../models/enums/role.enum.js";

const adminOrCompetenceLeader = authorizeRole([roleEnum.ADMIN, roleEnum.COMPETENCE_LEADER]);

// GET all future skills
router.get('/', authenticateToken, getAllFutureSkills);

// POST a new future skill
router.post('/', authenticateToken, adminOrCompetenceLeader, createFutureSkill);

// PUT (update) a skill by ID
router.put('/:id', authenticateToken, adminOrCompetenceLeader, updateFutureSkill);

// DELETE a skill by ID
router.delete('/:id', authenticateToken, adminOrCompetenceLeader, deleteFutureSkill);

router.post('/send-email', authenticateToken, adminOrCompetenceLeader, sendFutureSkillMail);

export default router;
