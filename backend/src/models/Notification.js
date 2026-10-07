const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    recipientRole: {
      type: String,
      enum: ['therapist', 'client'],
      required: true,
    },
    type: {
      type: String,
      enum: [
        'BookingConfirmation',
        'AppointmentReminder',
        'PaymentConfirmation',
        'SessionFollowUp',
        'HomeworkAssigned',
        'MoodLogged',
        'General',
      ],
      default: 'General',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: '',
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
