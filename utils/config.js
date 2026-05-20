const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://Gilbert_db_user:REDACTED@cluster1.2arnqyw.mongodb.net/bloglist?retryWrites=true&w=majority&appName=Cluster1'

const PORT = process.env.PORT || 3002

module.exports = {
  MONGODB_URI,
  PORT,
}
