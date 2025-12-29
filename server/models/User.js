const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },

  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },

  profilePicture: {
    type: String,
    default: null
  },

  settings: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'light'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      }
    }
  },

  // FIX: Move these inside schema
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },

  lastPasswordChange: {
    type: Date,
    default: Date.now
  }

}, {
  timestamps: true
});


// FIX: Combine password hashing + update lastPasswordChange
userSchema.pre('save', async function (next) {
  try {
    // If password is modified → hash it
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, salt);
      this.lastPasswordChange = Date.now();
    }
    next();
  } catch (error) {
    next(error);
  }
});


// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


// Index for performance
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
