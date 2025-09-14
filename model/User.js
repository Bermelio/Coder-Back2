const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  first_name: 
  { type: String,
    required: true },

  last_name:  
  { type: String,
    required: true },

  email:      
  { type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true },

  age:        
  { type: Number, 
    default: null },

  password:   
  { type: String, 
    required: true },

  cart:       
  { type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart', default: null },

  role:       
  { type: String, 
    default: 'user' }
    
}, { timestamps: true });

userSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  const SALT_ROUNDS = 10;
  this.password = bcrypt.hashSync(this.password, SALT_ROUNDS);
  next();
});

userSchema.methods.isValidPassword = function(plainPassword) {
  return bcrypt.compareSync(plainPassword, this.password);
};

const User = mongoose.model('User', userSchema, 'Users');
module.exports = User;
