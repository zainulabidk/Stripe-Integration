const express = require('express');
const { register, login, getCsrfToken } = require('../controllers/authController');
const { registerSchema, loginSchema } = require('../validators/authValidator');
const validate = require('../middleware/validate.js');
const csrf = require('csurf');


const router = express.Router();
const csrfProtection = csrf({ cookie: true });

 router.get('/csrf-token', csrfProtection, getCsrfToken);
router.post('/register', csrfProtection, validate(registerSchema), register);
router.post('/login', csrfProtection, validate(loginSchema), login);


module.exports = router;
