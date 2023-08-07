const { User } = require("../models/user.model");

async function setUserInfo(data) {
  return await User.create({
    userId: data.userId,
    email: data.email,
    nickname: data.nickname,
    imageUrl: data.imageUrl,
    learningTime: data.learningTime,
  });
}

async function getUserInfo(data) {
  return await User.findByPk(data.userId);
}

async function setUserNickname(data) {
  return await User.update(
    { nickname: data.nickname },
    {
      where: {
        userId: data.userId,
      },
    }
  );
}

module.exports = {
  setUserInfo,
  getUserInfo,
  setUserNickname,
};
