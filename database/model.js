const mongoose = require("mongoose");

const secretSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  secret: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Secret", secretSchema);
