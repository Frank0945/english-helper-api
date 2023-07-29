const AwardedBadge = require("../services/awardedBadge.service");

async function awardedBadge(req, res, next) {
  try {
    res.json(await AwardedBadge.awardedBadge(req.body));
  } catch (err) {
    next(err);
  }
}

async function listBadgesByUserId(req, res, next) {
  try {
    res.json(await AwardedBadge.listBadgesByUserId(req.body));
  } catch (err) {
    next(err);
  }
}

module.exports = {
  awardedBadge,
  listBadgesByUserId,
};
