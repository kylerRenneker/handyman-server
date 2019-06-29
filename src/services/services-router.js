const express = require('express')
const ServiceListService = require('./services-service')

const servicesRouter = express.Router()

servicesRouter
    .route('/')
    .get((req, res, next) => {
        ServiceListService.getAllServices(req.app.get('db'))
            .then(services => {
                res.json(services)
            })
            .catch(next)
    })

module.exports = servicesRouter