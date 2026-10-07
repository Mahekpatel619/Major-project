const mongoose = require('mongoose');

const sessionNoteSchema = new mongoose.Schema(
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
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
    },
    title: {
      type: String,
      default: 'Session Clinical Progress Note',
    },
    noteType: {
      type: String,
      enum: ['private', 'shared'],
      default: 'private', // CRITICAL: Private by default; clients can NEVER view private notes
      index: true,
    },
    templateType: {
      type: String,
      enum: ['freeform', 'soap', 'dap'],
      default: 'soap',
    },
    content: {
      type: String, // Freeform or summary content
      default: '',
    },
    soap: {
      subjective: { type: String, default: '' },
      objective: { type: String, default: '' },
      assessment: { type: String, default: '' },
      plan: { type: String, default: '' },
    },
    dap: {
      data: { type: String, default: '' },
      assessment: { type: String, default: '' },
      plan: { type: String, default: '' },
    },
    riskAssessment: {
      suicidalIdeation: { type: Boolean, default: false },
      selfHarm: { type: Boolean, default: false },
      riskNotes: { type: String, default: 'Low clinical safety risk observed.' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SessionNote', sessionNoteSchema);
