const { Test } = require("../models/test.model");

async function getUserInfo() {
  try {
    const test = await Test.findOne({
      where: {
        badge_id: 1
      }
    });
    return test;
  } catch (error) {
    console.error("Error:", error);
  }
}

module.exports = {
  getUserInfo
};
