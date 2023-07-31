const user = require("../services/user.service");
const { isMyself } = require("../filters/auth");

async function setUserInfo(req, res, next) {
  try {
    res.json(await user.setUserInfo(req.body));
  } catch (err) {
    next(err);
  }
}

async function getUserInfo(req, res, next) {
  try {
    console.log(req.user_id);
    // isMyself(req.headers);
    res.json(await user.getUserInfo(req.body));
  } catch (err) {
    next(err);
  }
}

async function setUserNickname(req, res, next) {
  try {
    res.json(await user.setUserNickname(req.body));
  } catch (err) {
    next(err);
  }
}

module.exports = {
  setUserInfo,
  getUserInfo,
  setUserNickname,
};
