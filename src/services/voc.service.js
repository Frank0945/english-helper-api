const { RegularVoc } = require("../models/vocabulary/regularVoc.model");
const { Voc } = require("../models/vocabulary/voc.model");
const sequelize = require("./db.service").sequelize;
const { Op } = require("sequelize");

const vocsPerDay = 10;
const optionsNum = 3;
const vocsForChoice = 40;

async function getDaliyVocs(data) {
  try {
    const untestedVocs = await getDaliyVocsUntested(data);
    let needUpload = false;
    let rtnVocs = untestedVocs.data;
    if (!untestedVocs.fullQuota) {
      needUpload = true;
      rtnVocs = await RegularVoc.findAll({
        where: {
          vocId: {
            [Op.notIn]: sequelize.literal(
              `(SELECT vocId FROM vocabularies WHERE userId = ${data.userId} AND corrected IS NOT NULL)`
            ),
          },
        },
        order: sequelize.random(),
        limit: vocsPerDay,
      });
    }
    if (!rtnVocs) {
      return [];
    }
    const rtnVocsIdsSet = new Set(rtnVocs.map((row) => row.vocId));
    const randomVocs = await RegularVoc.findAll({
      where: {
        vocId: {
          [Op.notIn]: rtnVocsIdsSet,
        },
      },
      order: sequelize.random(),
      limit: rtnVocs.length * optionsNum,
    });

    randomVocs.forEach((voc, idx) => {
      const groupIndex = Math.floor(idx / optionsNum);
      const group = rtnVocs[groupIndex].dataValues;
      const options = group.options || [];
      options.push(voc);
      group.options = options;
    });

    if (needUpload) {
      await addDaliyVoc(rtnVocs, data.userId);
    }
    return rtnVocs;
  } catch (error) {
    console.error("error");
    throw error;
  }
}

/**
 * @returns {{ data: [], fullQuota: boolean }}
 */
async function getDaliyVocsUntested(data) {
  try {
    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const result = await RegularVoc.findAll({
      attributes: [
        "vocId",
        "vocabulary",
        "explain",
        [
          sequelize.literal(
            "(SELECT corrected FROM vocabularies WHERE vocabularies.vocId = regular_vocabularies.vocId)"
          ),
          "corrected",
        ],
      ],
      where: {
        vocId: {
          [Op.in]: sequelize.literal(
            `(SELECT vocId FROM vocabularies WHERE
               userId = ${data.userId} AND 
               createdAt > FROM_UNIXTIME(${TODAY_START / 1000})
            )`
          ),
        },
      },
    });
    return {
      data: result.filter((item) => item.dataValues.corrected == null),
      fullQuota: !!result.length,
    };
  } catch (error) {
    console.error("error");
    throw error;
  }
}

async function addDaliyVoc(data, userId) {
  data = data.map((row) => {
    return {
      userId,
      vocId: row.vocId,
      createdAt: sequelize.literal("NOW()"),
    };
  });
  return await Voc.bulkCreate(data, {
    updateOnDuplicate: ["createdAt"],
  });
}

async function setCorrected(data) {
  return await Voc.update(
    { corrected: data.corrected },
    {
      where: {
        userId: data.userId,
        vocId: data.vocId,
      },
    }
  );
}

async function setMarked(data) {
  return await Voc.update(
    { marked: data.marked === undefined ? true : data.marked },
    {
      where: {
        userId: data.userId,
        vocId: data.vocId,
      },
    }
  );
}

async function setIsUsed(data) {
  return await Voc.update(
    { used: true },
    {
      where: {
        userId: data.userId,
        vocId: data.vocId,
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
 * @param {number} cursor - the cursor of the last vocId in the last page
 * @param {string} rule - the SQL rule to filter the vocs
 */
async function listByRule(data, cursor = 0, rule) {
  return await RegularVoc.findAll({
    where: {
      vocId: {
        [Op.in]: sequelize.literal(
          `(SELECT vocId FROM vocabularies WHERE userId = ${data.userId} AND ${rule})`
        ),
        [Op.gt]: cursor,
      },
    },
    order: [["vocId", "ASC"]],
    limit: vocsForChoice,
  });
}

module.exports = {
  getDaliyVocs,
  setCorrected,
  setMarked,
  setIsUsed,
  listIsUsed,
  listNotUsed,
  listIsMarked,
};
