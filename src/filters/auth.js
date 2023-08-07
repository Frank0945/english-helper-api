function isMyself(req, userId) {
  return new Promise((resolve, reject) => {
    if (req.isAuthenticated()) {
      if (req.session.passport.user.userId === userId) {
        resolve();
      } else {
        reject(new Error("Permission denied"));
      }
    }
    reject(new Error("Not authenticated"));
  });
}

function isLogin(req) {
  return new Promise((resolve, reject) =>
    req.isAuthenticated() ? resolve() : reject(new Error("Not authenticated"))
  );
}

module.exports = {
  isMyself,
  isLogin,
};
