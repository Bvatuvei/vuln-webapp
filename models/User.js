const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({ //creates the format that is to be expected for users to login and register
  username: String,
  password: String // Plaintext — should be hashed but isn't in the case to make it more vulnerable
});

module.exports = mongoose.model('User', UserSchema);
