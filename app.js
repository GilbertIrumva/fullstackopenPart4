const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')
const config = require('./utils/config')

const app = express()

mongoose.connect(config.MONGODB_URI)
	.then(() => {
		console.log('Connected to MongoDB')
	})
	.catch((error) => {
		console.error('MongoDB connection error:', error.message)
		process.exit(1)
	})

app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
