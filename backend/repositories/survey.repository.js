import Survey from '../models/survey.model.js'

export const findAllSurveys = () =>
    Survey.find()
        .sort({ createdAt: -1 })
        .populate('createdBy', 'username firstName lastName')
        .populate('recipients', 'username firstName lastName email')

export const findSurveyById = (surveyId) =>
    Survey.findById(surveyId)
        .populate('createdBy', 'username firstName lastName')
        .populate('recipients', 'username firstName lastName email')

export const createSurvey = (surveyData) =>
    new Survey(surveyData).save()

export const updateSurvey = (surveyId, updateData) =>
    Survey.findByIdAndUpdate(surveyId, updateData, {
        new: true,
        runValidators: true
    })
        .populate('createdBy', 'username firstName lastName')
        .populate('recipients', 'username firstName lastName email')

export const deleteSurvey = (surveyId) =>
    Survey.findByIdAndDelete(surveyId)

export const publishSurvey = (surveyId) =>
    Survey.findOneAndUpdate(
        { _id: surveyId, status: 'draft' },
        { status: 'published', publishedAt: new Date() },
        { new: true, runValidators: true }
    )
        .populate('recipients', 'username firstName lastName email')
