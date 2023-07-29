const user = require("../services/user.service");

async function setUserInfo(req, res, next) {
  try {
    res.json(await user.setUserInfo(req.body));
  } catch (err) {
    next(err);
  }
}
module.exports = {
  setUserInfo
};
