import * as surveyRepository from '../repositories/survey.repository.js'
import { createNotification } from './notification.service.js'

export const getAllSurveys = () => surveyRepository.findAllSurveys()

export const getSurveyById = (surveyId) => surveyRepository.findSurveyById(surveyId)

export const createSurvey = (surveyData, createdBy) =>
    surveyRepository.createSurvey({ ...surveyData, createdBy })

export const updateSurvey = (surveyId, updateData) =>
    surveyRepository.updateSurvey(surveyId, updateData)

export const deleteSurvey = (surveyId) => surveyRepository.deleteSurvey(surveyId)

export const publishSurvey = async (surveyId) => {
    const survey = await surveyRepository.publishSurvey(surveyId)

    if (!survey) {
        return null
    }

    await Promise.all(survey.recipients.map(recipient =>
        createNotification({
            recipient: recipient._id,
            type: 'survey',
            title: survey.title,
            description: survey.description || 'Eine neue Umfrage ist verfügbar.',
            deadline: survey.deadline,
            status: 'open'
        })
    ))

    return survey
}
