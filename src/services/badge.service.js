const { AwardedBadge } = require("../models/badge/awardedBadge.model");
const { Badges } = require("../models/badge/badges.model");

async function awardedBadge(userId, badgeId) {
  try {
    return await AwardedBadge.create(
      {
        userId,
        badgeId,
      },
      { updateOnDuplicate: ["badgeId"] },
    );
  } catch (error) {
    throw new Error(error);
  }
}

async function listBadgesByUserId(_, userId) {
  try {
    return await AwardedBadge.findAll({
      where: {
        userId,
      },
      include: { model: Badges },
    });
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  awardedBadge,
  listBadgesByUserId,
};
