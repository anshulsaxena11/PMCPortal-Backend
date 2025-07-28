const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const loginSchema = new mongoose.Schema({
  empId:{
     type: mongoose.Schema.Types.ObjectId,
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email:{
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: [8, 'Password must be at least 8 characters long'],
    validate: {
      validator: function (value) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&^])[A-Za-z\d@$!%*?#&^]{8,}$/.test(value);
      },
      message:
        'Password must include uppercase, lowercase, number, and special character.'
    }
  },
  role: {
    type: String,
    enum: ['Admin', 'SubAdmin', 'User'],
    default: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdByIp:{
    type:String
  },
  createdById:{
    type:String,
  },
  isDeleted:{
    type:Boolean,
    default:false
  },
  ipAddressLog: [
    {
      ip: { type: String },
      date: { type: Date, default: null }
    }
  ]
});

loginSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const isAlreadyHashed = /^\$2[aby]\$/.test(this.password); // bcrypt hash pattern
  if (isAlreadyHashed) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});


loginSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Login', loginSchema);
