const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

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

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('blogs have id field (not _id)', async () => {
  const response = await api.get('/api/blogs')
  for (const blog of response.body) {
    assert.ok(blog.id, 'Blog is missing id field')
    assert.strictEqual(blog._id, undefined, 'Blog should not have _id field')
  }
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'New blog',
    author: 'Tester',
    url: 'https://example.com/new',
    likes: 7
  };

  const blogsAtStart = await api.get('/api/blogs');

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await api.get('/api/blogs');
  assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length + 1);

  const titles = blogsAtEnd.body.map(b => b.title);
  assert.ok(titles.includes(newBlog.title));
});

test('if likes is missing, it defaults to 0', async () => {
  const newBlog = {
    title: 'No likes blog',
    author: 'No Likes',
    url: 'https://example.com/nolikes'
  };

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  assert.strictEqual(response.body.likes, 0);
});

after(async () => {
  await mongoose.connection.close()
})