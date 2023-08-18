const { AwardedBadge } = require("../models/badge/awardedBadge.model");
const { Badges } = require("../models/badge/badges.model");

async function awardedBadge(data) {
  return await AwardedBadge.create({
    userId: data.userId,
    badgeId: data.badgeId,
  });
}

async function listBadgesByUserId(data) {
  return await AwardedBadge.findAll({
    where: {
      userId: data.userId,
    },
    include: { model: Badges },
  });
}

module.exports = {
  awardedBadge,
  listBadgesByUserId,
};
