const mongoose = require('mongoose');

const { Schema } = mongoose;

const newSchema = new Schema({
  name: { type: String },
  givenName: { type: String },
  familyName: { type: String },
  email: { type: String },
  picture: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', newSchema);
