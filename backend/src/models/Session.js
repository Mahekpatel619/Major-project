const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
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
    serviceName: {
      type: String,
      default: 'Individual Therapy Consultation',
    },
    date: {
      type: String, // "YYYY-MM-DD"
      required: true,
      index: true,
    },
    startTime: {
      type: String, // "10:00"
      required: true,
    },
    endTime: {
      type: String, // "10:50"
      required: true,
    },
    duration: {
      type: Number,
      default: 50,
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Completed', 'Cancelled', 'No-show'],
      default: 'Upcoming',
      index: true,
    },
    cancellationReason: {
      type: String,
      default: '',
    },
    cancelledAt: {
      type: Date,
    },
    meetingLink: {
      type: String,
      default: 'https://meet.google.com/unfazed-therapy-room',
    },
    sessionType: {
      type: String,
      enum: ['Online Video', 'In-Person Clinic', 'Phone'],
      default: 'Online Video',
    },
    fee: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'PackageCredit', 'Refunded'],
      default: 'Pending',
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    clientPackageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClientPackage',
    },
    clientNotes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Compound index to facilitate quick slot lookup and prevent double-booking checks
sessionSchema.index({ therapistId: 1, date: 1, startTime: 1 });

module.exports = mongoose.model('Session', sessionSchema);
