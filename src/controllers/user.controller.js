const { isMyself } = require("../filters/auth");
const user = require("../services/user.service");

async function setUserInfo(req, res, next) {
  try {
    res.json(await user.setUserInfo(req.body));
  } catch (err) {
    next(err);
  }
}

async function getUserInfo(req, res, next) {
  try {
    await isMyself(req, req.body.user_id);
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
