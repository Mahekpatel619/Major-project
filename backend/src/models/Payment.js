const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
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
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
    },
    clientPackageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClientPackage',
    },
    amount: {
      type: Number,
      required: true, // in INR
    },
    currency: {
      type: String,
      default: 'INR',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Successful', 'Failed', 'Refunded'],
      default: 'Pending',
      index: true,
    },
    orderId: {
      type: String, // Razorpay order_id
      index: true,
    },
    transactionId: {
      type: String, // Razorpay payment_id
      index: true,
    },
    paymentMethod: {
      type: String,
      default: 'UPI / NetBanking / Card',
    },
    invoiceNumber: {
      type: String,
      unique: true,
    },
    invoiceUrl: {
      type: String,
    },
    paidAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
