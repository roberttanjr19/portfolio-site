const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ error: 'User not found' });

    const isValid = await user.authenticate(req.body.password);
    if (!isValid) return res.status(401).json({ error: 'Email and password do not match' });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('t', token, { expires: new Date(Date.now() + 24 * 60 * 60 * 1000) });
    return res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.signout = (req, res) => {
  res.clearCookie('t');
  return res.status(200).json({ message: 'Signed out successfully' });
};
