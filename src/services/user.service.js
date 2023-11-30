const { Session } = require("../models/session.model");
const { User } = require("../models/user.model");

async function setUserInfo(data) {
  try {
    return await User.create({
      userId: data.userId,
      email: data.email,
      nickname: data.nickname,
      imageUrl: data.imageUrl,
      learningTime: data.learningTime,
    });
  } catch (error) {
    throw new Error(error);
  }
}

async function getUserInfo(userId) {
  try {
    return await User.findByPk(userId);
  } catch (error) {
    throw new Error(error);
  }
}

async function getUserDetail(_, userId) {
  try {
    return await User.findByPk(userId, {
      attributes: ["learningTime"],
    });
  } catch (error) {
    throw new Error(error);
  }
}

async function incrementLearningTime(userId, add) {
  try {
    return await User.increment(
      { learningTime: add },
      {
        where: {
          userId,
        },
      },
    );
  } catch (error) {
    throw new Error(error);
  }
}

async function setUserNickname(data, userId, sessionID) {
  try {
    await User.update(
      { nickname: data.nickname },
      {
        where: {
          userId,
        },
      },
    );
    return await updateToSession(data.nickname, sessionID);
  } catch (error) {
    throw new Error(error);
  }
}

async function updateToSession(nickname, sid) {
  try {
    const session = await Session.findOne({ where: { sid } });

    if (session) {
      const dataValues = session.dataValues;
      const data = JSON.parse(dataValues.data);
      data.passport.user.nickname = nickname;
      session.dataValues.data = JSON.stringify(data);

      return await Session.update(
        { data: session.dataValues.data },
        {
          where: {
            sid,
          },
        },
      );
    } else {
      throw new Error("Session not found.");
    }
  } catch (err) {
    throw new Error(err.sqlMessage);
  }
}
module.exports = {
  setUserInfo,
  getUserInfo,
  getUserDetail,
  setUserNickname,
  incrementLearningTime,
};
