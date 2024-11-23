// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next(); // User is an admin; proceed
  }
  res.status(403).json({ msg: 'Access denied. Admins only.' });
};

module.exports = isAdmin;
