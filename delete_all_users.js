const mongoose = require('mongoose');
const User = require('./models/user');
const config = require('./utils/config');

async function deleteAllUsers() {
  await mongoose.connect(config.MONGODB_URI);
  await User.deleteMany({});
  console.log('All users deleted.');
  await mongoose.connection.close();
}

deleteAllUsers();
