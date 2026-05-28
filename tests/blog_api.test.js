const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('nwhen there is iitially some blogs saved', () => {
  let token

  beforeEach(async () => {
    await Blog.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const uniqueUsername = `root_${Date.now()}_${Math.floor(Math.random() * 10000)}`
    const user = new User({ username: uniqueUsername, name: 'Superuser', passwordHash })
    const savedUser = await user.save()

    token = jwt.sign(
      { username: savedUser.username, id: savedUser._id },
      process.env.SECRET || 'dev_secret'
    )

    const initialBlogsWithUser = helper.initialBlogs.map(blog => ({
      ...blog,
      user: savedUser._id
    }))

    await Blog.insertMany(initialBlogsWithUser)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blogs have id field (not _id)', async () => {
    const response = await api.get('/api/blogs')
    for (const blog of response.body) {
      assert.ok(blog.id, 'Blog is missing id field')
      assert.strictEqual(blog._id, undefined, 'Blog should not have _id field')
    }
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'New blog',
        author: 'Tester',
        url: 'https://example.com/new',
        likes: 7
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(b => b.title)
      assert.ok(titles.includes(newBlog.title))
    })

    test('if likes is missing, it defaults to 0', async () => {
      const newBlog = {
        title: 'No likes blog',
        author: 'No Likes',
        url: 'https://example.com/nolikes'
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, 0)
    })

    test('fails with status code 400 if title is missing', async () => {
      const newBlog = {
        author: 'No Title',
        url: 'https://example.com/notitle',
        likes: 1
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })


    test('fails with status code 400 if url is missing', async () => {
      const newBlog = {
        title: 'No URL',
        author: 'No Url',
        likes: 1
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with status code 401 if token is missing', async () => {
      const newBlog = {
        title: 'No token blog',
        author: 'Unauthorized User',
        url: 'https://example.com/notoken',
        likes: 3
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

      const ids = blogsAtEnd.map(b => b.id)
      assert.ok(!ids.includes(blogToDelete.id))
    })

    test('fails with status code 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .delete(`/api/blogs/${invalidId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
    })
  })

  describe('updating a blog', () => {
    test('succeeds with status 200 and updates likes', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedData = { ...blogToUpdate, likes: blogToUpdate.likes + 100 }

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedData)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, blogToUpdate.likes + 100)

      const blogsAtEnd = await helper.blogsInDb()
      const updated = blogsAtEnd.find(b => b.id === blogToUpdate.id)
      assert.strictEqual(updated.likes, blogToUpdate.likes + 100)
    })

    test('fails with status code 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api
        .put(`/api/blogs/${validNonexistingId}`)
        .send({ likes: 5 })
        .expect(404)
    })

    test('fails with status code 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .put(`/api/blogs/${invalidId}`)
        .send({ likes: 5 })
        .expect(400)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
