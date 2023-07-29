const { User } = require("../models/user.model");

async function setUserInfo(data) {
  return await User.create({
    user_id: data.user_id,
    email: data.email,
    nickname: data.nickname,
    image_url: data.image_url,
    learning_time: data.learning_time
  });
}

module.exports = {
  setUserInfo
};
