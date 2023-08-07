/* eslint-disable no-caller */
const awardedBadgeService = require("../services/awardedBadge.service");
const { controller } = require("./_controller");

async function awardedBadge(req, res, next) {
  await controller(req, res, next, awardedBadgeService[arguments.callee.name]);
}

async function listBadgesByUserId(req, res, next) {
  await controller(req, res, next, awardedBadgeService[arguments.callee.name]);
}

module.exports = {
  awardedBadge,
  listBadgesByUserId,
};
