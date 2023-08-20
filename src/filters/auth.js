function isLogin(req) {
  return !!req.isAuthenticated();
}

module.exports = {
  isLogin,
};
