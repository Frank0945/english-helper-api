const { User } = require("../models/user.model");

async function setUserInfo(data) {
  return await User.create({
    user_id: data.user_id,
    email: data.email,
    nickname: data.nickname,
    image_url: data.image_url,
    learning_time: data.learning_time,
  });
}

async function getUserInfo(data) {
  return await User.findByPk(data.user_id);
}

async function setUserNickname(data) {
  return await User.update({ nickname: data.nickname }, {
    where: {
      user_id: data.user_id,
    },
  });
}

module.exports = {
  setUserInfo,
  getUserInfo,
  setUserNickname,
};
