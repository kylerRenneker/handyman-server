const express = require('express')
const ReviewsService = require('./reviews-service')
const { requireAuth } = require('../middlware/jwt-auth')

const reviewsRouter = express.Router()
const jsonBodyParser = express.json()

reviewsRouter.route('/').post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { provider_id, rating, text } = req.body;
    const newReview = { provider_id, rating, text };

    for (const [key, value] of Object.entries(newReview))
        if (value == null)
            return res.status(400).json({
                error: `Missing '${key}' in request body`
            });

    newReview.user_id = req.user.id;

    ReviewsService.insertReview(req.app.get('db'), newReview)
        .then(review => {
            res
                .status(201)
                .json(ReviewsService.serializeReview(review));
        })
        .catch(next);
});

module.exports = reviewsRouter;