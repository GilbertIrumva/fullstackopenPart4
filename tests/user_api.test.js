const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', name: 'Superuser', passwordHash })
  await user.save()
})

test('creation fails if username is missing', async () => {
  const newUser = { name: 'No Username', password: 'validpass' }
  const result = await api.post('/api/users').send(newUser).expect(400)
  assert.match(result.body.error, /username/i)
})

test('creation fails if username is too short', async () => {
  const newUser = { username: 'ab', name: 'Short', password: 'validpass' }
  const result = await api.post('/api/users').send(newUser).expect(400)
  assert.match(result.body.error, /username/i)
})

test('creation fails if password is missing', async () => {
  const newUser = { username: 'validuser', name: 'No Password' }
  const result = await api.post('/api/users').send(newUser).expect(400)
  assert.match(result.body.error, /password/i)
})

test('creation fails if password is too short', async () => {
  const newUser = { username: 'validuser', name: 'Short', password: '12' }
  const result = await api.post('/api/users').send(newUser).expect(400)
  assert.match(result.body.error, /password/i)
})

test('creation fails if username is not unique', async () => {
  const newUser = { username: 'root', name: 'Duplicate', password: 'validpass' }
  const result = await api.post('/api/users').send(newUser).expect(400)
  assert.match(result.body.error, /unique/i)
})

after(async () => {
  await mongoose.connection.close()
})
