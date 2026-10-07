const mongoose = require('mongoose');

const homeworkSchema = new mongoose.Schema(
  {
    therapistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Therapist',
      required: true,
      index: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide homework title'],
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    dueDate: {
      type: String, // "YYYY-MM-DD"
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending',
      index: true,
    },
    resources: [
      {
        title: { type: String, required: true },
        type: { type: String, enum: ['PDF', 'Link', 'Video', 'Worksheet'], default: 'Link' },
        url: { type: String, required: true },
        description: { type: String },
      },
    ],
    completedAt: {
      type: Date,
    },
    clientReflection: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Homework', homeworkSchema);
