const { AwardedBadge } = require("../models/badge/awardedBadge.model");
const { Badges } = require("../models/badge/badges.model");

async function awardedBadge(userId, badgeId) {
  return await AwardedBadge.bulkCreate(
    {
      userId,
      badgeId,
    },
    {
      updateOnDuplicate: ["badgeId"],
    },
  );
}

async function listBadgesByUserId(_, userId) {
  return await AwardedBadge.findAll({
    where: {
      userId,
    },
    include: { model: Badges },
  });
}

module.exports = {
  awardedBadge,
  listBadgesByUserId,
};
