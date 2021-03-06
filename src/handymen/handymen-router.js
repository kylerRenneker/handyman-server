const express = require('express')
const HandymenService = require('./handymen-service')

const handymenRouter = express.Router()

handymenRouter
    .route('/')
    .get((req, res, next) => {
        HandymenService.getHandymenByLocation(
            req.app.get('db'),
            req.query.zipcode,
            req.query.service
        )
            .then(handymen => {
                const hmBoolArr = handymen.map(hm => hm.services.includes(Number(req.query.service)))
                if (handymen.length < 1 || hmBoolArr.every(item => item === false)) {
                    return res.status(404).json({
                        error: 'No providers found'
                    })
                }
                else {
                    res.json(HandymenService.serializeProviders(handymen))
                }
            })
            .catch(next)
    })

handymenRouter
    .route('/:handymanId')
    .all(checkProviderExists)
    .get((req, res) => {
        res.json(HandymenService.serializeProvider(res.provider))
    })

handymenRouter
    .route('/:handymanId/reviews/')
    .all(checkProviderExists)
    .get((req, res, next) => {
        HandymenService.getReviewsForHandymen(
            req.app.get('db'),
            req.params.handymanId
        )
            .then(reviews => {
                res.json(HandymenService.serializeProviderReviews(reviews))
            })
            .catch(next)
    })

handymenRouter
    .route('/user/:userId')
    .get((req, res, next) => {
        HandymenService.getByUserId(
            req.app.get('db'),
            req.params.userId
        )
            .then(provider => {
                res.json(provider)
            })
            .catch(next)
    })


async function checkProviderExists(req, res, next) {
    try {
        const provider = await HandymenService.getById(
            req.app.get('db'),
            req.params.handymanId,
            req.query.zipcode
        )

        if (!provider)
            return res.status(404).json({
                error: 'That provider does not exist'
            })
        res.provider = provider
        next()
    }
    catch (error) {
        next(error)
    }
}


module.exports = handymenRouter