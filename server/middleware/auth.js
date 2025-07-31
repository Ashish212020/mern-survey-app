// server/middleware/auth.js
const jwt = require('jsonwebtoken');

// Use the JWT_SECRET from the .env file
// This is the secure way to handle secrets for deployment.
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = function(req, res, next) {
  // Get token from the 'x-auth-token' header
  const token = req.header('x-auth-token');

  // Check if no token is provided
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify the token
  try {
    // Decode the token using the secret key
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach the user's ID from the token payload to the request object
    req.user = decoded.user;
    
    // Move to the next middleware or route handler
    next();
  } catch (err) {
    // If the token is not valid (e.g., expired or incorrect), send an error
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
