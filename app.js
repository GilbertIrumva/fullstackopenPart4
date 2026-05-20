const express = require('express')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')

const app = express()

app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
