const express = require('express')
const QuoteService = require('./quote-service')
const { requireAuth } = require('../middlware/jwt-auth')

const quoteRouter = express.Router()
const jsonBodyParser = express.json()

quoteRouter
    .route('/')
    .post(requireAuth, jsonBodyParser, (req, res, next) => {
        const { provider_id, user_id, location, email, description, services } = req.body
        const newQuoteRequest = { provider_id, user_id, location, email, description, services }

        for (const [key, value] of Object.entries(newQuoteRequest))
            if (value == null || value == '')
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                });

        QuoteService.insertQuote(req.app.get('db'), newQuoteRequest)
            .then(quote => {
                res.json(QuoteService.serializeQuote(quote))
            })
            .catch(next)
    })

module.exports = quoteRouter