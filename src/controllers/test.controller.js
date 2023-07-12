const test = require('../services/test.service');

async function getUserInfo(req, res, next) {
  try {
      res.json(await test.getUserInfo());
  } catch (err) {
      console.error(`Error`, err.message);
      next(err);
  }
}
module.exports = {
  getUserInfo,
};