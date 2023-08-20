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

async function getUserInfo(userId) {
  return await User.findByPk(userId);
}

async function setUserNickname(data, userId) {
  return await User.update(
    { nickname: data.nickname },
    {
      where: {
        userId,
      },
    }
  );
}

module.exports = {
  setUserInfo,
  getUserInfo,
  setUserNickname,
};
