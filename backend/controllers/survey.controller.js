import mongoose from 'mongoose'
import * as surveyService from '../services/survey.service.js'

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value)

const validateQuestions = (questions) => {
    if (questions === undefined) return null
    if (!Array.isArray(questions)) return 'Questions must be an array'

    for (const question of questions) {
        if (!question.text || !question.type) return 'Every question needs text and type'
        if (['single_choice', 'multiple_choice'].includes(question.type)
            && (!Array.isArray(question.options) || question.options.length === 0)) {
            return 'Choice questions need at least one option'
        }
    }

    return null
}

const validateSurveyData = (data) => {
    if (data.title !== undefined && !String(data.title).trim()) {
        return 'Title is required'
    }

    const questionError = validateQuestions(data.questions)
    if (questionError) return questionError

    if (data.recipients !== undefined) {
        if (!Array.isArray(data.recipients)
            || data.recipients.some(recipient => !isObjectId(recipient))) {
            return 'Recipients must be an array of valid user IDs'
        }
    }

    return null
}

export const getAllSurveys = async (req, res) => {
    try {
        res.status(200).json(await surveyService.getAllSurveys())
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch surveys', error: error.message })
    }
}

export const getSurveyById = async (req, res) => {
    try {
        if (!isObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid survey ID' })
        }

        const survey = await surveyService.getSurveyById(req.params.id)
        if (!survey) return res.status(404).json({ message: 'Survey not found' })

        res.status(200).json(survey)
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch survey', error: error.message })
    }
}

export const createSurvey = async (req, res) => {
    try {
        const validationError = validateSurveyData(req.body)
        if (validationError) return res.status(400).json({ message: validationError })

        const survey = await surveyService.createSurvey(req.body, req.user.id)
        res.status(201).json(survey)
    } catch (error) {
        res.status(400).json({ message: 'Failed to create survey', error: error.message })
    }
}

export const updateSurvey = async (req, res) => {
    try {
        if (!isObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid survey ID' })
        }

        const validationError = validateSurveyData(req.body)
        if (validationError) return res.status(400).json({ message: validationError })

        const survey = await surveyService.updateSurvey(req.params.id, req.body)
        if (!survey) return res.status(404).json({ message: 'Survey not found' })

        res.status(200).json(survey)
    } catch (error) {
        res.status(400).json({ message: 'Failed to update survey', error: error.message })
    }
}

export const deleteSurvey = async (req, res) => {
    try {
        if (!isObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid survey ID' })
        }

        const deleted = await surveyService.deleteSurvey(req.params.id)
        if (!deleted) return res.status(404).json({ message: 'Survey not found' })

        res.status(200).json({ message: 'Survey deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete survey', error: error.message })
    }
}

export const publishSurvey = async (req, res) => {
    try {
        if (!isObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid survey ID' })
        }

        const survey = await surveyService.publishSurvey(req.params.id)
        if (!survey) {
            return res.status(404).json({ message: 'Draft survey not found' })
        }

        res.status(200).json(survey)
    } catch (error) {
        res.status(500).json({ message: 'Failed to publish survey', error: error.message })
    }
}
