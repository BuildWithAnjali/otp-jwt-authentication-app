const express = require ('express');
const router = express.Router();
const {register, login, verifyOtp, logoutUser} = require('../controller/userController');
const { verifyToken } = require('../middleware/authMiddleware');




router.post('/register' , register);

router.post('/login' , login);
router.post('/verify-otp',verifyOtp);
router.post('/logout' , verifyToken , logoutUser)

router.post("/auto-login", async (req, res) => {
  const { rememberToken } = req.body;
  if (!rememberToken) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(rememberToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(401).json({ message: "User not found" });

    // Create new accessToken
    const newAccessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    user.accessToken = newAccessToken;
    await user.save();

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

router.get("/me", authenticateToken, async (req, res) => {
  // This will be executed after JWT token is validated
  const user = await User.findById(req.user.id); // Assuming user data is attached in req.user
  res.json(user);
});
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract Bearer token

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = user; // Attach user data to request object
    next();
  });
}





module.exports = router;