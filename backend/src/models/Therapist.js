const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const therapistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      default: 'therapist',
      immutable: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      default: 'Licensed Clinical Psychologist',
    },
    bio: {
      type: String,
      default: 'Helping individuals navigate anxiety, stress, depression, and personal growth with evidence-based approaches.',
    },
    specializations: {
      type: [String],
      default: ['Anxiety & Depression', 'CBT', 'Mindfulness', 'Relationship Therapy'],
    },
    languages: {
      type: [String],
      default: ['English', 'Hindi'],
    },
    experience: {
      type: Number,
      default: 7, // Years of practice
    },
    consultationFee: {
      type: Number,
      default: 1500, // in INR
    },
    services: [
      {
        id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
        name: { type: String, required: true },
        duration: { type: Number, default: 50 }, // in minutes
        price: { type: Number, required: true },
        description: { type: String },
      },
    ],
    profileImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1594824813571-638f02636142?auto=format&fit=crop&q=80&w=600',
    },
    phone: {
      type: String,
      default: '+91 98765 43210',
    },
    clinicAddress: {
      type: String,
      default: 'Indiranagar, Bengaluru / Online (Video)',
    },
    qualifications: {
      type: [String],
      default: ['M.Phil in Clinical Psychology (NIMHANS)', 'RCI Licensed'],
    },
    subscriptionPlan: {
      type: String,
      enum: ['Free', 'Pro', 'Premium'],
      default: 'Pro',
    },
    subscriptionExpiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
    customBranding: {
      accentColor: { type: String, default: '#4672bc' },
      tagline: { type: String, default: 'Your Safe Space for Growth' },
    },
  },
  { timestamps: true }
);

// Hash password before saving
therapistSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password helper
therapistSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Therapist', therapistSchema);
