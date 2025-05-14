const User = require('../models/model'); // Make sure the model is properly imported
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../config/nodemailer');

// Register User with OTP
const register = async (req, res) => {
    const { username, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email format" });
}

    if (!username || !email || !password) {
        return res.json({ success: false, message: "Missing details" });
    }

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
       
        const user = new User({
            username,
            email,
            password: hashedPassword,
           
        });

        await user.save();

      


        return res.status(200).json({ success: true, message: "successfully registerd as a user" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Login User
// const login = async (req, res) => {
//     const { email, password } = req.body;  //remenber token after jwt

//     if (!email || !password) {
//         return res.status(401).json({ success: false, message: 'Email and password are required' });
//     }

//     try {
//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.json({ success: false, message: "User not found" });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.json({ success: false, message: "Invalid password" });
//         }

//     //     if (!user.isVerified) {
//     //   return res.status(400).json({ message: 'Please verify your email first' });
//     // }
//      const otp = String(Math.floor(100000 + Math.random() * 900000));
//         user.otp = otp;
       
//          const otpExpires = Date.now() + 24 * 60 * 60 * 1000; // OTP expires in 24 hours
//          user.otpExpires;
//         await user.save();

//         const mailOptions = {
//             from: process.env.SENDER_EMAIL,
//             to: user.email,
//             subject: 'Account Verification OTP',
//             text: `Your OTP is ${otp}. Verify your account using this OTP.`,
//         };

//         await transporter.sendMail(mailOptions);

//     //     const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     //     const remeberToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

//     //     user.accessToken = accessToken;
//     // user.rememberToken = rememberToken;

//         // await user.save();

//         // res.cookie('token', token, {
//         //     httpOnly: true,
//         //     secure: process.env.NODE_ENV === 'production',
//         //     sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
//         //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//         // });

//         return res.status(200).json({
//             success: true,
//             message: "Login successful",
//             otp,
//             otpExpires,
//             //  accessToken,
//             //  rememberToken,
//             user: { id: user._id, username: user.username, email: user.email,isVerified: user.isVerified },
//         });

//     } catch (error) {
//         return res.json({ success: false, message: error.message });
//     }
// };

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(401).json({ success: false, message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid password" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const otpExpires = Date.now() + 24 * 60 * 60 * 1000;
        const accessToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
        user.accessToken = accessToken;
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            text: `Your OTP is ${otp}. It is valid for 24 hours.`,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log("OTP sent to email:", user.email);
        } catch (err) {
            console.error("OTP Email Error:", err);
            return res.status(500).json({ success: false, message: "Failed to send OTP email" });
        }

        return res.status(200).json({
            success: true,
            message: "Login successful, OTP sent",
            otp,
            otpExpires,
            accessToken,
            user: { id: user._id, username: user.username, email: user.email, isVerified: user.isVerified },
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};




// // Logout User
// const logout = async (req, res) => {
//     const userId = req.user?.id;
//     try {
//         // Clear the cookie
//         res.clearCookie('token', {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
//         });

//         const user = await User.findById(userId);
//         if (!user) return res.json({ success: false, message: "User not found" });

//         user.accessToken = null;
//         await user.save();

//         res.json({ success: true, message: "Logged out successfully" });

//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

// Send OTP for Verification
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Generate tokens
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const rememberToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    user.accessToken = accessToken;
    user.rememberToken = rememberToken;
    user.otp = null;
    user.otpExpires = null;
    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: 'OTP verified', accessToken, rememberToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// controllers/authController.js
// adjust the path as per your structure

// Logout Controller
const logoutUser = async (req, res) => {
  try {
    // Check if the token is provided in the header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract Bearer token

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by decoded token ID
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

user.accessToken = null; // Or you can use delete user.accessToken; to remove the field completely

    await user.save(); // Save the updated user document without accessToken



    // Clear the JWT cookie (if using cookies for the token)
    res.clearCookie('token'); // Make sure 'token' matches the cookie name you're using

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: 'Server error during logout' });
  }
};



// const VerifyOtp = async (req, res) => {
//     try {
//         const userId = req.user.userId;
//         const user = await User.findById(userId);

//         if (user.isVerified) {
//             return res.json({ success: false, message: 'Account already verified' });
//         }

//         const otp = String(Math.floor(100000 + Math.random() * 900000));
//         user.otp = otp;
//         user.otpExpires = Date.now() + 24 * 60 * 60 * 1000; // OTP expires in 24 hours
//         await user.save();

//         const mailOptions = {
//             from: process.env.SENDER_EMAIL,
//             to: user.email,
//             subject: 'Account Verification OTP',
//             text: `Your OTP is ${otp}. Verify your account using this OTP.`,
//         };

//         await transporter.sendMail(mailOptions);

//         res.json({ success: true, message: 'Verification OTP sent to your email' });

//     } catch (error) {
//         res.json({ success: false, message: error.message });
//     }
// };

// Verify Email with OTP
// const verifyEmail = async (req, res) => {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//         return res.status(400).json({ success: false, message: 'Missing details' });
//     }

//     try {
//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }

//         if (user.otp !== otp) {
//             return res.status(400).json({ success: false, message: 'Invalid OTP' });
//         }

//         if (user.otpExpires < Date.now()) {
//             return res.status(400).json({ success: false, message: 'OTP expired' });
//         }

//         user.isVerified = true;
//         user.otp = '';
//         user.otpExpires = 0; // Reset OTP expiry time

//         await user.save();

//         const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
//         const rememberToken = crypto.randomBytes(32).toString("hex");

//         user.accessToken = accessToken;
//         user.rememberToken = rememberToken;
//         await user.save();

//         return res.status(200).json({
//             success: true,
//             accessToken,
//             rememberToken,
//             message: 'Email verified successfully',
//         });

//     } catch (error) {
//         return res.status(500).json({ success: false, message: error.message });
//     }
// };



module.exports = {
    register,
    login,
   logoutUser,
    verifyOtp,
    
    
};
