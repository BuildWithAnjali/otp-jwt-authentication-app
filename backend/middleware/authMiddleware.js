const jwt = require('jsonwebtoken');
const User = require('../models/model'); // Adjust model path if necessary

// Middleware for verifying the token passed via Authorization header
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authorization token missing or malformed.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    console.log("Verifying token:", token); // Debug: log token being verified

    // Decode token and verify user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Debug: log decoded token

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Please login again.',
      });
    }

    // Add user info to request object
    req.user = { userId: decoded.id };
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("Token verification failed:", err); // Debug: log error during token verification

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = { verifyToken };
