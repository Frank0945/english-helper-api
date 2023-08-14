const { RegularVoc } = require("../models/vocabulary/regularVoc.model");
const { Voc } = require("../models/vocabulary/voc.model");
const sequelize = require("./db.service").sequelize;
const { Op } = require("sequelize");

const vocPerDay = 10;
const optionsNum = 3;
const vocForChoice = 40;

async function getDaliyvoc(data) {
  try {
    const untestedvoc = await getDaliyvocUntested(data);
    let needUpload = false;
    let rtnvoc = untestedvoc.data;
    if (!untestedvoc.fullQuota) {
      needUpload = true;
      rtnvoc = await RegularVoc.findAll({
        where: {
          vocId: {
            [Op.notIn]: sequelize.literal(
              `(SELECT vocId FROM vocabulary WHERE userId = ${data.userId} AND corrected IS NOT NULL)`
            ),
          },
        },
        order: sequelize.random(),
        limit: vocPerDay,
      });
    }
    if (!rtnvoc) {
      return [];
    }
    const rtnvocIdsSet = new Set(rtnvoc.map((row) => row.vocId));
    const randomvoc = await RegularVoc.findAll({
      where: {
        vocId: {
          [Op.notIn]: rtnvocIdsSet,
        },
      },
      order: sequelize.random(),
      limit: rtnvoc.length * optionsNum,
    });

    randomvoc.forEach((voc, idx) => {
      const groupIndex = Math.floor(idx / optionsNum);
      const group = rtnvoc[groupIndex].dataValues;
      const options = group.options || [];
      options.push(voc);
      group.options = options;
    });

    if (needUpload) {
      await addDaliyVoc(rtnvoc, data.userId);
    }
    return rtnvoc;
  } catch (error) {
    console.error("error");
    throw error;
  }
}

/**
 * @returns {{ data: [], fullQuota: boolean }}
 */
async function getDaliyvocUntested(data) {
  try {
    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const result = await RegularVoc.findAll({
      attributes: [
        "vocId",
        "vocabulary",
        "explain",
        [
          sequelize.literal(
            "(SELECT corrected FROM vocabulary WHERE vocabulary.vocId = regular_vocabulary.vocId)"
          ),
          "corrected",
        ],
      ],
      where: {
        vocId: {
          [Op.in]: sequelize.literal(
            `(SELECT vocId FROM vocabulary WHERE
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
    { marked: data.marked },
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
 * Will **not return** the voc that have been marked
 */
async function listNotUsed(data) {
  return await listByRule(
    data,
    data.cursor || 0,
    "used = 1 OR marked = 1",
    Op.notIn
  );
}

/**
 * Will **not return** the voc that have been marked
 */
async function listIsUsed(data) {
  return await listByRule(data, data.cursor || 0, "used = 1 AND marked <> 1");
}

async function listIsMarked(data) {
  return await listByRule(data, data.cursor || 0, "marked = 1");
}

/**
 * @param {number} cursor - the cursor of the last vocId in the last page
 * @param {string} rule - the SQL rule to filter the voc
 * @param {unique symbol} ruleType - the SQL rule type
 */
async function listByRule(data, cursor = 0, rule, ruleType = Op.in) {
  return await RegularVoc.findAll({
    where: {
      vocId: {
        [ruleType]: sequelize.literal(
          `(SELECT vocId FROM vocabulary WHERE userId = ${data.userId} AND ${rule})`
        ),
        [Op.gt]: cursor,
      },
    },
    order: [["vocId", "ASC"]],
    limit: vocForChoice,
  });
}

module.exports = {
  getDaliyvoc,
  setCorrected,
  setMarked,
  setIsUsed,
  listIsUsed,
  listNotUsed,
  listIsMarked,
};
