const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../model/User');
require('dotenv').config();

passport.use('register', new LocalStrategy(
  { usernameField: 'email', passReqToCallback: true },
  async (req, email, password, done) => {
    try {
      const { first_name, last_name, age } = req.body;
      const existing = await User.findOne({ email });
      if (existing) return done(null, false, { message: 'Email ya registrado' });

      const newUser = new User({ first_name, last_name, email, age, password });
      await newUser.save();
      return done(null, newUser);
    } catch (err) {
      return done(err);
    }
  }
));

passport.use('login', new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) return done(null, false, { message: 'Usuario no encontrado' });

      const valid = user.isValidPassword(password);
      if (!valid) return done(null, false, { message: 'Contraseña incorrecta' });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'your_jwt_secret'
};

passport.use('jwt', new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findById(jwt_payload.id).select('-password');
    if (user) return done(null, user);
    return done(null, false);
  } catch (err) {
    return done(err, false);
  }
}));

module.exports = passport;
