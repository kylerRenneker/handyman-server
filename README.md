# Handyman API

[Live site](https://handyman-app.krenneker16.now.sh/)

### API-Endpoint
https://rugged-mesa-verde-83925.herokuapp.com/api

## Summary

This API allows users to search for (GET) handymen by location & service, post a new user (handyman or client), post quote-requests, and post reviews.

## Documentation

### Public Routes

* GET - /providers
  * This endpoint is used to GET a list of providers by location and service selected
* POST - /auth/login
  * This endpoint is use to post a login request
* POST - /users
  * Used for signing up as a new user (handyman or client)

### Private Routes

* POST - /reviews
  * Used to post a review on Handyman
* POST - /quote
  * Used to post quote request
  
## Technologies Used

 * Node
 * Express
 * Knex
 * PostgreSQL




## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.
