const mongoose = require('mongoose');

const { Schema } = mongoose;

const newSchema = new Schema({
  title: { type: String },
  content: { type: String },
  image: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  comments: [{
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Pin', newSchema);
