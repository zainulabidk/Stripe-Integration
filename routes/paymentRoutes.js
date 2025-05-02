const express = require('express');
const { createStripeSession,createPaymentIntent } = require('../controllers/paymentController');

const router = express.Router();
router.post('/create-checkout-session', createStripeSession);
router.post('/create-payment-intent', createPaymentIntent);

module.exports = router;
