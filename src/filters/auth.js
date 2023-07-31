const passport = require("passport");

function isMyself(headers) {
  const reqUserId = headers.authorization.split("Bearer ")[1];
  console.log("reqUserId", reqUserId);
}

module.exports = {
  isMyself,
};
