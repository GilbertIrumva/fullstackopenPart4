const dummy = (blogs) => 1

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => sum + blog.likes
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  let favorite = blogs[0]

  blogs.forEach(blog => {
    if (blog.likes > favorite.likes) {
      favorite = blog
    }
  })

  return favorite
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const counts = {}

  blogs.forEach(blog => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
  })

  let topAuthor = ''
  let max = 0

  for (const author in counts) {
    if (counts[author] > max) {
      max = counts[author]
      topAuthor = author
    }
  }

  return { author: topAuthor, blogs: max }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const likes = {}

  blogs.forEach(blog => {
    likes[blog.author] = (likes[blog.author] || 0) + blog.likes
  })

  let topAuthor = ''
  let max = 0

  for (const author in likes) {
    if (likes[author] > max) {
      max = likes[author]
      topAuthor = author
    }
  }

  return { author: topAuthor, likes: max }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}