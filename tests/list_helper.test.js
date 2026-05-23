const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('total likes', () => {

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])

    assert.strictEqual(result, 0)
  })

  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'my first unity test blog',
      author: 'Gilbert',
      url: 'http://www.example.com',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)

    assert.strictEqual(result, 5)
  })
})

describe('favorite blog', () => {

  const blogs = [
    {
      title: 'First blog',
      author: 'Gilbert',
      likes: 5
    },
    {
      title: 'Second blog',
      author: 'John',
      likes: 12
    },
    {
      title: 'Third blog',
      author: 'Mary',
      likes: 7
    }
  ]

  test('blog with most likes is returned', () => {
    const result = listHelper.favoriteBlog(blogs)

    assert.deepStrictEqual(result, {
      title: 'Second blog',
      author: 'John',
      likes: 12
    })
  })
})