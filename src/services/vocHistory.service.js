const { vocHistory } = require("../models/vocabulary/vocHistory.model");
const sequelize = require("./db.service").sequelize;

const maxVocAmount = 20;

async function listHistoryvoc(data) {
  return await vocHistory.findAll({
    where: { userId: data.userId },
    order: [["createdAt", "DESC"]],
    attributes: ["voc"],
  });
}

async function addvoc(data) {
  try {
    const cData = data.voc.map((voc) => {
      return {
        userId: data.userId,
        voc,
      };
    });
    const created = await vocHistory.bulkCreate(cData, {
      updateOnDuplicate: ["createdAt"],
    });

    await limitVocAmount(data);

    return created;
  } catch (error) {
    console.error("error");
    throw error;
  }
}

async function limitVocAmount(data) {
  try {
    const query = `
    DELETE FROM voc_history
    WHERE (userId, voc) IN (
      SELECT userId, voc
      FROM (
        SELECT userId, voc, ROW_NUMBER() OVER (PARTITION BY userId ORDER BY createdAt DESC) AS row_num
        FROM voc_history
        WHERE userId = ${data.userId}
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

async function removeVoc(data) {
  return await vocHistory.destroy({
    where: { userId: data.userId, voc: data.voc },
  });
}

module.exports = {
  listHistoryvoc,
  addvoc,
  removeVoc,
};
