const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const clientSchema = new mongoose.Schema(
  {
    therapistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Therapist',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide client name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide client email'],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      default: 'client',
      immutable: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Active', 'Lead', 'Inactive', 'Archived'],
      default: 'Active',
      index: true,
    },
    tags: {
      type: [String],
      default: ['General Anxiety'],
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['Female', 'Male', 'Non-Binary', 'Prefer not to say', 'Other'],
      default: 'Prefer not to say',
    },
    emergencyContact: {
      name: { type: String, default: '' },
      relationship: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    intakeCompleted: {
      type: Boolean,
      default: false,
    },
    intakeData: {
      presentingConcern: { type: String, default: '' },
      previousTherapyExperience: { type: String, default: '' },
      currentMedications: { type: String, default: '' },
      goalsForTherapy: { type: String, default: '' },
    },
    consentSigned: {
      type: Boolean,
      default: false,
    },
    consentSignedAt: {
      type: Date,
    },
    notesSummary: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Hash password before saving
clientSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
clientSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Compound index to ensure uniqueness of email per therapist practice or globally
clientSchema.index({ email: 1, therapistId: 1 }, { unique: true });

module.exports = mongoose.model('Client', clientSchema);
