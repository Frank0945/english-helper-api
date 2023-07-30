const userVoc = require("../services/userVoc.service");

async function getUserDaliyVoc(req, res, next) {
  try {
    res.json(await userVoc.getUserDaliyVoc(req.body));
  } catch (err) {
    next(err);
  }
}

async function setUserDaliyVocCorrected(req, res, next) {
  try {
    res.json(await userVoc.setUserDaliyVocCorrected(req.body));
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUserDaliyVoc,
  setUserDaliyVocCorrected,
};
