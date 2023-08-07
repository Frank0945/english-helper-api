/* eslint-disable no-caller */
const voc = require("../services/voc.service");
const { controller } = require("./_controller");

async function getDaliyVocs(req, res, next) {
  await controller(req, res, next, voc[arguments.callee.name]);
}

async function setCorrected(req, res, next) {
  await controller(req, res, next, voc[arguments.callee.name]);
}

async function setMarked(req, res, next) {
  await controller(req, res, next, voc[arguments.callee.name]);
}

async function setIsUsed(req, res, next) {
  await controller(req, res, next, voc[arguments.callee.name]);
}

async function listNotUsed(req, res, next) {
  await controller(req, res, next, voc[arguments.callee.name]);
}

async function listIsUsed(req, res, next) {
  await controller(req, res, next, voc[arguments.callee.name]);
}

async function listIsMarked(req, res, next) {
  await controller(req, res, next, voc[arguments.callee.name]);
}

module.exports = {
  getDaliyVocs,
  setCorrected,
  setMarked,
  setIsUsed,
  listNotUsed,
  listIsUsed,
  listIsMarked,
};
