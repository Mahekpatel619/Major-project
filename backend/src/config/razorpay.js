const Razorpay = require('razorpay');

let razorpayInstance = null;

const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_123';
const keySecret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_456';

try {
  razorpayInstance = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
} catch (err) {
  console.warn('Razorpay SDK init in simulated mode:', err.message);
}

module.exports = {
  razorpay: razorpayInstance,
  keyId,
  isMock: keyId.includes('mock') || keyId.includes('Mock'),
};
