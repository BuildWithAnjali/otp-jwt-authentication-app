// const mongoose = require("mongoose");
// const bcrypt = require('bcryptjs')
// const userSchema = new mongoose.Schema({
//     name : {type: String , required : true },
//     email : {type : String ,  required :  true , unique : true},
//     password : {type : String ,  required :  true },
//     verifyOtp : {type : String ,  default: '' },
//     otp : {type: String , default: ''},
//     otpExpiry : {Date},
//     verifyOtpExpireAt : {type : Number,  default: 0 },
//     isAccountVerified : {type : Boolean,  default: false },
//     resetOtp : {type : String,  default: '' },
//     resetOtpExpireAt : {type :Number,  default: 0 },
   

//     // models/userModel.js
// rememberToken: {
//   type: String,
//   default: null
// },
// accessToken: {
//   type: String,
//   default: null
// },


// })

// // Hash password before save
// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next();
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// });


// const userModel = mongoose.models.user || mongoose.model("user",userSchema);

// module.exports= userModel;

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username:{type:String },
  email: { type: String, unique: true },
  password: String,
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpires: Date,
  accessToken: String,
  rememberToken: String,
});

module.exports = mongoose.model('User', userSchema);

