const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');  
const csrf = require('csurf');

const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

 
app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

 
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);

 app.use(errorHandler);

module.exports = app;
