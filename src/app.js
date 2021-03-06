require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const handymenRouter = require('./handymen/handymen-router')
const servicesRouter = require('./services/services-router')
const authRouter = require('./auth/auth-routher')
const usersRouter = require('./users/users-router')
const reviewsRouter = require('./reviews/reviews-router')
const quoteRouter = require('./quotes/quote-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.use('/api', servicesRouter)
app.use('/api/providers', handymenRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/reviews', reviewsRouter)
app.use('/api/quote', quoteRouter)


app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app
