function asyncWrap(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => {
      next(err);
    });
  };
}

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res
      .status(401)
      .json({ error: "You must be logged in to access this page" });
  }
  next();
};

module.exports = { asyncWrap, isLoggedIn };
