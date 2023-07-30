const { AwardedBadge } = require("../models/badge/awardedBadge.model");
const { Badges } = require("../models/badge/badges.model");

async function awardedBadge(data) {
  return await AwardedBadge.create({
    user_id: data.user_id,
    badge_id: data.badge_id,
    awarded_time: data.awarded_time,
  });
}

async function listBadgesByUserId(data) {
  return await AwardedBadge.findAll({
    where: {
      user_id: data.user_id,
    },
    include: { model: Badges },
  });
}

module.exports = {
  awardedBadge,
  listBadgesByUserId,
};
