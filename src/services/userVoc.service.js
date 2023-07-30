const { RegularVoc } = require("../models/vocabulary/regularVoc.model");
const { UserVoc } = require("../models/vocabulary/userVoc.model");
const sequelize = require("../services/db.service").sequelize;
const { Op } = require("sequelize");

const vocsPerDay = 10;
const optionsNum = 3;

async function getUserDaliyVoc(data) {
  return new Promise((resolve, reject) => {
    RegularVoc.findAll({
      where: {
        voc_id: {
          [Op.notIn]: sequelize.literal(
            `(SELECT voc_id FROM user_vocabularies WHERE user_id = ${data.user_id} AND corrected <> 0)`
          ),
        },
      },
      order: sequelize.random(),
      limit: vocsPerDay,
    })
      .then((rtnVocs) => {
        const rtnVocsIdsSet = new Set(rtnVocs.map((row) => row.voc_id));
        RegularVoc.findAll({
          where: {
            voc_id: {
              [Op.notIn]: rtnVocsIdsSet,
            },
          },
          order: sequelize.random(),
          limit: vocsPerDay * optionsNum,
        })
          .then((randomVocs) => {
            randomVocs.forEach((voc, idx) => {
              const groupIndex = Math.floor(idx / optionsNum);
              const group = rtnVocs[groupIndex].dataValues;
              const options = group.options || [];
              options.push(voc);
              group.options = options;
            });

            addUserDaliyVoc(rtnVocs, data.user_id)
              .then(() => {
                resolve(rtnVocs);
              })
              .catch((error) => {
                reject(error);
              });
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function addUserDaliyVoc(data, userId) {
  data = data.map((row) => {
    return {
      user_id: userId,
      voc_id: row.voc_id,
      corrected: 0,
    };
  });
  return await UserVoc.bulkCreate(data);
}

async function setUserDaliyVocCorrected(data) {
  return await UserVoc.update({ corrected: true }, {
    where: {
      user_id: data.user_id,
      voc_id: data.voc_id,
    },
  });
}

module.exports = {
  getUserDaliyVoc,
  addUserDaliyVoc,
  setUserDaliyVocCorrected,
};
