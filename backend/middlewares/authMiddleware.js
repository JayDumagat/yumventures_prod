const authMiddleware = (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: "Unauthorized: No session found" });
    }
  
    req.user = req.session.user;
    next();
  };
  
  module.exports = authMiddleware;