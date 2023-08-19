function isMyself(req, userId) {
  return new Promise((resolve, reject) => {
    if (req.isAuthenticated()) {
      if (req.session.passport.user.userId === userId) {
        resolve(true);
      } else {
        reject(new Error("Permission denied"));
      }
    }
    reject(new Error("Not authenticated"));
  });
}

function isLogin(req) {
  return !!req.isAuthenticated();
}

module.exports = {
  isMyself,
  isLogin,
};
