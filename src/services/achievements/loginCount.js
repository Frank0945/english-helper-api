const { LoginCounts } = require("../../models/achievement/loginCount.model.js");
const { awardedBadge } = require("../badge.service.js");

async function loginCount(_, userId) {
  try {
    const result = await LoginCounts.findOne({
      where: {
        userId,
      },
    });
    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    if (!result) {
      return await LoginCounts.create({
        userId,
        loginCount: 1,
      });
    }
    let rtnValue = result;
    if (result.dataValues.updatedAt < TODAY_START) {
      if (result.dataValues.loginCount + 1 === 3) {
        await awardedBadge(userId, 1);
        rtnValue = { badgeId: 1 };
      }
      await result.increment("loginCount");
    }
    return rtnValue;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  loginCount,
};
