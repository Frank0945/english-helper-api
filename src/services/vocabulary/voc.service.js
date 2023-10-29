const { RegularVoc } = require("../../models/vocabulary/regularVoc.model");
const { Voc } = require("../../models/vocabulary/voc.model");
const sequelize = require("../_db.service").sequelize;
const { Op } = require("sequelize");

const vocPerDay = 10;
const optionsNum = 3;
const vocForChoice = 40;

async function getDaliyvoc(_, userId) {
  try {
    const untestedVoc = await getDaliyvocUntested(userId);
    let needUpload = false;
    let rtnvoc = untestedVoc.data;
    if (!untestedVoc.fullQuota) {
      needUpload = true;
      rtnvoc = await RegularVoc.findAll({
        where: {
          vocId: {
            [Op.notIn]: sequelize.literal(
                            `(SELECT vocId FROM vocabulary WHERE userId = ${userId} AND correct IS NOT NULL)`,
            ),
          },
        },
        attributes: {
          include: [
            [
              sequelize.literal(
                "(SELECT marked FROM vocabulary WHERE vocabulary.vocId = regular_vocabulary.vocId)",
              ),
              "marked",
            ],
          ],
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
      const group = rtnvoc[groupIndex].dataValues || rtnvoc[groupIndex];
      const options = group.options || [];
      options.push(voc);
      group.options = options;
    });

    if (needUpload) {
      await addDaliyVoc(rtnvoc, userId);
    }
    return { voc: rtnvoc, vocPerDay };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * @returns {{ data: [], fullQuota: boolean }}
 */
async function getDaliyvocUntested(userId) {
  try {
    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const result = await RegularVoc.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(
              "(SELECT marked FROM vocabulary WHERE vocabulary.vocId = regular_vocabulary.vocId)",
            ),
            "marked",
          ],
          [
            sequelize.literal(
              "(SELECT correct FROM vocabulary WHERE vocabulary.vocId = regular_vocabulary.vocId)",
            ),
            "correct",
          ],
        ],
      },
      where: {
        vocId: {
          [Op.in]: sequelize.literal(
                        `(SELECT vocId FROM vocabulary WHERE
               userId = ${userId} AND 
               createdAt > FROM_UNIXTIME(${TODAY_START / 1000}) AND 
               addFromDaily = true
            )`,
          ),
        },
      },
    });
    return {
      data: result
        .filter((item) => item.dataValues.correct == null)
        .map((item) => {
          const { correct, ...newItem } = item.dataValues;
          return newItem;
        }),
      fullQuota: !!result.length,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function addDaliyVoc(data, userId) {
  try {
    data = data.map((row) => {
      return {
        userId,
        vocId: row.vocId,
        addFromDaily: true,
        createdAt: sequelize.literal("NOW()"),
      };
    });
    return await Voc.bulkCreate(data, {
      updateOnDuplicate: ["createdAt"],
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function setCorrect(data, userId) {
  try {
    return await Voc.update({ correct: data.correct }, {
      where: {
        userId,
        vocId: data.vocId,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function setMarked(data, userId) {
  try {
    return await Voc.create({ userId, vocId: data.vocId, marked: data.marked }, {
      updateOnDuplicate: ["marked"],
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function setIsUsed(data, userId) {
  try {
    data = data.map((vocId) => {
      return {
        userId,
        vocId,
        used: true,
      };
    });
    return await Voc.bulkCreate(data, {
      updateOnDuplicate: ["used"],
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * Will **not return** the voc that have been marked
 */
async function listNotUsed(data, userId) {
  try {
    return await listByRule(
      userId,
      data.cursor || 0,
      "used = 1 OR marked = 1",
      Op.notIn,
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * Will **not return** the voc that have been marked
 */
async function listIsUsed(data, userId) {
  try {
    return await listByRule(
      userId,
      data.cursor || 0,
      "used = 1 AND marked <> 1",
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function listIsMarked(data, userId) {
  try {
    return await listByRule(userId, data.cursor || 0, "marked = 1");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * @param {number} cursor - the cursor of the last vocId in the last page
 * @param {string} rule - the SQL rule to filter the voc
 * @param {unique symbol} ruleType - the SQL rule type
 */
async function listByRule(userId, cursor = 0, rule, ruleType = Op.in) {
  return await RegularVoc.findAll({
    where: {
      vocId: {
        [ruleType]: sequelize.literal(
                    `(SELECT vocId FROM vocabulary WHERE userId = ${userId} AND ${rule})`,
        ),
        [Op.gt]: cursor,
      },
    },
    order: [
      ["vocId", "ASC"]
    ],
    limit: vocForChoice,
  });
}

module.exports = {
  getDaliyvoc,
  setCorrect,
  setMarked,
  setIsUsed,
  listIsUsed,
  listNotUsed,
  listIsMarked,
};
