const express = require('express')
const UsersService = require('./users-service')
const AuthService = require('../auth/auth-service')
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
        const { id, full_name, user_name, email } = req.user
        const newUser = { id, full_name, user_name, email }
        res.send(JSON.stringify(newUser))
    })

usersRouter
    .route('/:userId')
    .patch(jsonBodyParser, (req, res, next) => {
        let { full_name, user_name, password, email } = req.body

        for (const field of ['full_name', 'user_name', 'password', 'email'])
            if (!req.body[field])
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })

        const passwordError = UsersService.validatePassword(password)

        if (passwordError)
            return res.status(400).json({ error: passwordError })

        UsersService.getUserById(
            req.app.get('db'),
            req.params.userId
        )
            .then(user => user)
            .then(res => UsersService.hashPassword(password))
            .then(res => password = res)
            .then(res => {
                return AuthService.getUserWithUserName(
                    req.app.get('db'),
                    user_name
                )
            })
            .then(res => {
                if (!res) {
                    return null;
                }
                else {
                    if (res.id !== Number(req.params.userId)) {
                        return res.status(404).json({
                            error: 'That username is taken'
                        })
                    }
                }

            })
            .then(res => {
                const updatedUser = { full_name, user_name, password, email }
                return UsersService.updateUser(
                    req.app.get('db'),
                    req.params.userId,
                    updatedUser
                )
            })
            .then(() => {
                res.status(201).end()
            })
            .catch(next)
    })



//checkFields was meant to share the functionality between user sign on and update user but would 
//not stop parent function from continuing to run despite errors

// const checkFields = (req, res, password) => {
//     for (const field of ['full_name', 'user_name', 'password', 'email'])
//         if (!req.body[field])
//             return res.status(400).json({
//                 error: `Missing '${field}' in request body`
//             })

//     const passwordError = UsersService.validatePassword(password)

//     if (passwordError)
//         return res.status(400).json({ error: passwordError })
// }



module.exports = usersRouter