/* eslint-disable no-caller */
const userVoc = require("../services/userVoc.service");
const { controller } = require("./_controller");

async function getDaliyVocs(req, res, next) {
  await controller(req, res, next, userVoc[arguments.callee.name]);
}

async function setIsCorrected(req, res, next) {
  await controller(req, res, next, userVoc[arguments.callee.name]);
}

async function setMarked(req, res, next) {
  await controller(req, res, next, userVoc[arguments.callee.name]);
}

async function setIsUsed(req, res, next) {
  await controller(req, res, next, userVoc[arguments.callee.name]);
}

async function listNotUsed(req, res, next) {
  await controller(req, res, next, userVoc[arguments.callee.name]);
}

async function listIsUsed(req, res, next) {
  await controller(req, res, next, userVoc[arguments.callee.name]);
}

async function listIsMarked(req, res, next) {
  await controller(req, res, next, userVoc[arguments.callee.name]);
}

module.exports = {
  getDaliyVocs,
  setIsCorrected,
  setMarked,
  setIsUsed,
  listNotUsed,
  listIsUsed,
  listIsMarked,
};
