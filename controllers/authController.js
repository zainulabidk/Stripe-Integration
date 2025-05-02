const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateToken } = require('../utils/jwt');

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);

    // Create user first without createdBy/updatedBy
    const user = new User({ email, password: hashed });

    // Set createdBy and updatedBy to the user's own ID
    user.createdBy = user._id;
    user.updatedBy = user._id;

    await user.save();

    const token = generateToken(user._id);
    const csrfToken = req.csrfToken();

    res.status(201).json({
      email: user.email,
      token,
      csrfToken,
      createdBy: user.createdBy,
      updatedBy: user.updatedBy,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });

  } catch (err) {
    next(err);
  }
};


// Login function to authenticate users
// This function checks the provided email and password against the database
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ error: 'Invalid credentials' });

 
    
    const token = generateToken(user._id);
    const csrfToken = req.csrfToken();

    // 🛡️ Set cookies
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,        
      sameSite: 'Strict'
    });

    res.cookie('csrfToken', csrfToken, {
      httpOnly: false,  
      secure: true,
      sameSite: 'Strict'
    });

    // 📦 Also send in response for frontend storage if needed
    res.json({
      message: 'Login successful',
      email: user.email,
      token,
      csrfToken,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });

  } catch (err) {
    next(err);
  }
};


exports.getCsrfToken = (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
};