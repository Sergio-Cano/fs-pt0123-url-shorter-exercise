const router = require('express').Router()

const authRoutes = require('./auth')
const usersRoutes = require('./users')
const linksRoutes = require('./links')

module.exports = (db) => {
    router.use('/auth', authRoutes(db))
    router.use('/users', usersRoutes())
    router.use('/short', linksRoutes(db))

    return router
}