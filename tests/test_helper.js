const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'First blog',
    author: 'Gilbert',
    url: 'https://example.com/first',
    likes: 5
  },
  {
    title: 'Second blog',
    author: 'Gilbert',
    url: 'https://example.com/second',
    likes: 10
  }
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'willremovethissoon',
    author: 'temp',
    url: 'https://example.com/temp'
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
}
