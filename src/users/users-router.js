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
                                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
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
        console.log(serviceArr)

        // const newProvider = { user_id, provider_name, introduction, location, services: serviceArr }
        // console.log(newProvider)
        for (const field of ['provider_name', 'location', 'services'])
            if (!req.body[field])
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })
        req.app.get('db').raw('insert into providers(user_id, provider_name, introduction, services, location) values(?, ?, ?, ?, ?)', [`${user_id}`, `${provider_name}`, `${introduction}`, `${serviceArr}`, `${location}`])
            .then(function () {
                req.app.get('db').select().from('providers')
                    .then(function (providers) {
                        res.send(providers)
                    })
            })
        // UsersService.insertProvider(
        //     req.app.get('db'),
        //     newProvider
        // )
    })

usersRouter
    .route('/loggedIn')
    .all(requireAuth)
    .get((req, res) => {
        UsersService.getUserWithId(
            req.app.get('db'),
            req.user.id
        )
            .then(user => res.json(user))
            .catch(next)
    })



module.exports = usersRouter