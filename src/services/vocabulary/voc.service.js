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
              `(SELECT vocId FROM vocabulary WHERE userId = ${userId} AND corrected IS NOT NULL)`
            ),
          },
        },
        attributes: {
          include: [
            [
              sequelize.literal(
                "(SELECT marked FROM vocabulary WHERE vocabulary.vocId = regular_vocabulary.vocId)"
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
      const group = rtnvoc[groupIndex].dataValues;
      const options = group.options || [];
      options.push(voc);
      group.options = options;
    });

    if (needUpload) {
      await addDaliyVoc(rtnvoc, userId);
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
async function getDaliyvocUntested(userId) {
  try {
    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const result = await RegularVoc.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(
              "(SELECT marked FROM vocabulary WHERE vocabulary.vocId = regular_vocabulary.vocId)"
            ),
            "marked",
          ],
          [
            sequelize.literal(
              "(SELECT corrected FROM vocabulary WHERE vocabulary.vocId = regular_vocabulary.vocId)"
            ),
            "corrected",
          ],
        ],
      },
      where: {
        vocId: {
          [Op.in]: sequelize.literal(
            `(SELECT vocId FROM vocabulary WHERE
               userId = ${userId} AND 
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

async function setCorrected(data, userId) {
  return await Voc.update(
    { corrected: data.corrected },
    {
      where: {
        userId,
        vocId: data.vocId,
      },
    }
  );
}

async function setMarked(data, userId) {
  return await Voc.create(
    { userId, vocId: data.vocId, marked: data.marked },
    {
      updateOnDuplicate: ["marked"],
    }
  );
}

async function setIsUsed(data, userId) {
  return await Voc.create(
    { userId, vocId: data.vocId, used: true },
    {
      updateOnDuplicate: ["used"],
    }
  );
}

/**
 * Will **not return** the voc that have been marked
 */
async function listNotUsed(data, userId) {
  return await listByRule(
    userId,
    data.cursor || 0,
    "used = 1 OR marked = 1",
    Op.notIn
  );
}

/**
 * Will **not return** the voc that have been marked
 */
async function listIsUsed(data, userId) {
  return await listByRule(userId, data.cursor || 0, "used = 1 AND marked <> 1");
}

async function listIsMarked(data, userId) {
  return await listByRule(userId, data || 0, "marked = 1");
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
          `(SELECT vocId FROM vocabulary WHERE userId = ${userId} AND ${rule})`
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
