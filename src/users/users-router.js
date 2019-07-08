const express = require('express')
const path = require('path')
const UsersService = require('./users-service')
const { requireAuth } = require('../middlware/jwt-auth')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
    .post('/', jsonBodyParser, (req, res, next) => {
        const { password, user_name, full_name, email } = req.body

        for (const field of ['full_name', 'user_name', 'password', 'email'])
            if (!req.body[field])
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })

        // TODO: check user_name doesn't start with spaces

        const passwordError = UsersService.validatePassword(password)

        if (passwordError)
            return res.status(400).json({ error: passwordError })

        UsersService.hasUserWithUserName(
            req.app.get('db'),
            user_name
        )
            .then(hasUserWithUserName => {
                if (hasUserWithUserName)
                    return res.status(400).json({ error: `Username already taken` })

                return UsersService.hashPassword(password)
                    .then(hashedPassword => {
                        const newUser = {
                            user_name,
                            password: hashedPassword,
                            full_name,
                            email,
                            date_created: 'now()',
                        }

                        return UsersService.insertUser(
                            req.app.get('db'),
                            newUser
                        )
                            .then(user => {
                                res
                                    .status(201)
                                    .json(UsersService.serializeUser(user))
                            })
                    })
            })
            .catch(next)
    })

usersRouter
    .post('/handyman', jsonBodyParser, (req, res, next) => {
        const { user_id, provider_name, introduction, location, services } = req.body

        const serviceArr = '{' + services.join() + '}'

        if (!Number(location)) {
            return res.status(400).json({
                error: 'The location must be a 5 digit number'
            })
        }

        const newProvider = { user_id, provider_name, introduction, location, services: serviceArr }

        for (const field of ['provider_name', 'location', 'services'])
            if (!req.body[field])
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })
        UsersService.insertProvider(
            req.app.get('db'),
            newProvider
        )
            .then(user => {
                res.status(201)
                res.json(UsersService.serializeHandyman(user))
            })
            .catch(next)
    })

usersRouter
    .route('/loggedIn')
    .all(requireAuth)
    .get((req, res) => {
        console.log(req.user)
        const { id, email } = req.user
        const newUser = { id, email }
        res.send(JSON.stringify(newUser))
    })



module.exports = usersRouter