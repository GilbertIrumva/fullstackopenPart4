const express = require('express')
const mongoose = require('mongoose')

const app = express()

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl =
  process.env.MONGODB_URI ||
  'mongodb+srv://Gilbert_db_user:REDACTED@cluster1.2arnqyw.mongodb.net/bloglist?retryWrites=true&w=majority&appName=Cluster1'

app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((savedBlog) => {
    response.status(201).json(savedBlog)
  })
})

const PORT = 3002

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log('Connected to MongoDB')

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message)
    process.exit(1)
  })