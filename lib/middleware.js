const isLoggedInMiddleware = (req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn || false;
    next();
  };
  
  module.exports = {
    isLoggedInMiddleware,
  };
  