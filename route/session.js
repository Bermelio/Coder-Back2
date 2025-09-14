const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('../middleware/passport'); 
const User = require('../model/User');
require('dotenv').config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '1h';

router.post('/register', (req, res, next) => {
  passport.authenticate('register', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ error: info?.message || 'Registro falló' });
    const payload = { id: user._id, email: user.email, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.status(201).json({ message: 'Usuario creado', user: { id: user._id, email: user.email, first_name: user.first_name }, token });
  })(req, res, next);
});

router.post('/login', (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info?.message || 'Login falló' });

    const payload = { id: user._id, email: user.email, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ message: 'Login OK', token, user: { id: user._id, email: user.email, role: user.role } });
  })(req, res, next);
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
