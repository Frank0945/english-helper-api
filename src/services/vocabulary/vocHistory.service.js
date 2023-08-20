const { vocHistory } = require("../../models/vocabulary/vocHistory.model");
const sequelize = require("../_db.service").sequelize;

const maxVocAmount = 20;

async function listHistoryvoc(_, userId) {
  return await vocHistory.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
    attributes: ["voc"],
  });
}

async function addvoc(data, userId) {
  try {
    const cData = data.voc.map((voc) => {
      return {
        userId,
        voc,
      };
    });
    const created = await vocHistory.bulkCreate(cData, {
      updateOnDuplicate: ["createdAt"],
    });

    await limitVocAmount(userId);

    return created;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function limitVocAmount(userId) {
  try {
    const query = `
    DELETE FROM voc_history
    WHERE (userId, voc) IN (
      SELECT userId, voc
      FROM (
        SELECT userId, voc, ROW_NUMBER() OVER (PARTITION BY userId ORDER BY createdAt DESC) AS row_num
        FROM voc_history
        WHERE userId = ${userId}
      ) AS subquery
      WHERE row_num > ${maxVocAmount}
    );
  `;
    await sequelize.query(query);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function removeVoc(data, userId) {
  return await vocHistory.destroy({
    where: { userId, voc: data.voc },
  });
}

module.exports = {
  listHistoryvoc,
  addvoc,
  removeVoc,
};
