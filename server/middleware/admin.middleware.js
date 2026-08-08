const User = require('../models/user.model');

const requireAdmin = async (req, res, next) => {
  if (!req.auth) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = await User.findById(req.auth._id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden - Admin access required' });
    }
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Forbidden - Admin access required' });
  }
};

module.exports = { requireAdmin };
