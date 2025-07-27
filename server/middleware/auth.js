const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token, authorization denied' });
    }
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found, authorization denied' });
    }
    
    // Allow unverified users to delete their accounts
    const isAccountDeletionRoute = req.method === 'DELETE' && req.path === '/account';
    
    if (!user.isVerified && !isAccountDeletionRoute) {
      return res.status(401).json({ message: 'Email not verified, authorization denied' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error in authentication' });
  }
};

module.exports = authMiddleware;
