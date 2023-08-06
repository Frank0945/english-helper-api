const { RegularVoc } = require("../models/vocabulary/regularVoc.model");
const { UserVoc } = require("../models/vocabulary/userVoc.model");
const sequelize = require("../services/db.service").sequelize;
const { Op } = require("sequelize");

const vocsPerDay = 10;
const optionsNum = 3;
const vocsForChoice = 40;

async function getDaliyVocs(data) {
  try {
    let rtnVocs = await getDaliyVocsPublised(data);
    let needUpload = false;

    if (!rtnVocs) {
      needUpload = true;
      rtnVocs = await RegularVoc.findAll({
        where: {
          voc_id: {
            [Op.notIn]: sequelize.literal(
              `(SELECT voc_id FROM user_vocabularies WHERE user_id = ${data.user_id} AND corrected <> 0)`
            ),
          },
        },
        order: sequelize.random(),
        limit: vocsPerDay,
      });
    }
    const amount = rtnVocs.length;
    if (amount === 0) return [];

    const rtnVocsIdsSet = new Set(rtnVocs.map((row) => row.voc_id));
    const randomVocs = await RegularVoc.findAll({
      where: {
        voc_id: {
          [Op.notIn]: rtnVocsIdsSet,
        },
      },
      order: sequelize.random(),
      limit: amount * optionsNum,
    });

    randomVocs.forEach((voc, idx) => {
      const groupIndex = Math.floor(idx / optionsNum);
      const group = rtnVocs[groupIndex].dataValues;
      const options = group.options || [];
      options.push(voc);
      group.options = options;
    });

    if (needUpload) {
      await addDaliyVoc(rtnVocs, data.user_id);
    }
    return rtnVocs;
  } catch (error) {
    console.error("error");
    throw error;
  }
}

async function getDaliyVocsPublised(data) {
  try {
    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const result = await RegularVoc.findAll({
      attributes: [
        "voc_id",
        "vocabulary",
        "explain",
        [
          sequelize.literal(
            "(SELECT corrected FROM user_vocabularies WHERE user_vocabularies.voc_id = regular_vocabularies.voc_id AND user_vocabularies.corrected = true)"
          ),
          "corrected",
        ],
      ],
      where: {
        voc_id: {
          [Op.in]: sequelize.literal(
            `(SELECT voc_id FROM user_vocabularies WHERE
               user_id = ${data.user_id} AND 
               published = true AND 
               createdAt > ${TODAY_START}
            )`
          ),
        },
      },
    });
    return result.filter((item) => !item.dataValues.corrected);
  } catch (error) {
    console.error("error");
    throw error;
  }
}

async function addDaliyVoc(data, userId) {
  data = data.map((row) => {
    return {
      user_id: userId,
      voc_id: row.voc_id,
      published: true,
    };
  });
  return await UserVoc.bulkCreate(data);
}

async function setIsCorrected(data) {
  return await UserVoc.update(
    { corrected: true },
    {
      where: {
        user_id: data.user_id,
        voc_id: data.voc_id,
      },
    }
  );
}

async function setMarked(data) {
  return await UserVoc.update(
    { marked: data.marked === undefined ? true : data.marked },
    {
      where: {
        user_id: data.user_id,
        voc_id: data.voc_id,
      },
    }
  );
}

async function setIsUsed(data) {
  return await UserVoc.update(
    { used: true },
    {
      where: {
        user_id: data.user_id,
        voc_id: data.voc_id,
      },
    }
  );
}

/**
 * Will **not return** the vocs that have been marked
 */
async function listNotUsed(data) {
  return await listByRule(data, data.cursor || 0, "used <> 1 AND marked <> 1");
}

/**
 * Will **not return** the vocs that have been marked
 */
async function listIsUsed(data) {
  return await listByRule(data, data.cursor || 0, "used = 1 AND marked <> 1");
}

async function listIsMarked(data) {
  return await listByRule(data, data.cursor || 0, "marked = 1");
}

/**
 * @param {number} cursor - the cursor of the last voc_id in the last page
 * @param {string} rule - the SQL rule to filter the vocs
 */
async function listByRule(data, cursor = 0, rule) {
  return await RegularVoc.findAll({
    where: {
      voc_id: {
        [Op.in]: sequelize.literal(
          `(SELECT voc_id FROM user_vocabularies WHERE user_id = ${data.user_id} AND ${rule})`
        ),
        [Op.gt]: cursor,
      },
    },
    order: [["voc_id", "ASC"]],
    limit: vocsForChoice,
  });
}

module.exports = {
  getDaliyVocs,
  setIsCorrected,
  setMarked,
  setIsUsed,
  listIsUsed,
  listNotUsed,
  listIsMarked,
};
