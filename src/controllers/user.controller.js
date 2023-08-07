/* eslint-disable no-caller */
const user = require("../services/user.service");
const { controller } = require("./_controller");

async function setUserInfo(req, res, next) {
  await controller(req, res, next, user[arguments.callee.name]);
}

async function getUserInfo(req, res, next) {
  await controller(req, res, next, user[arguments.callee.name]);
}

async function setUserNickname(req, res, next) {
  await controller(req, res, next, user[arguments.callee.name]);
}

module.exports = {
  setUserInfo,
  getUserInfo,
  setUserNickname,
};
