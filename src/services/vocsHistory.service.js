const { VocsHistory } = require("../models/vocabulary/vocsHistory.model");

async function listHistoryVocs(data) {
  return await VocsHistory.findAll({
    where: { userId: data.userId },
    order: [["createdAt", "DESC"]],
    attributes: ["voc"],
  });
}

async function addVoc(data) {
  try {
    const created = await VocsHistory.create({
      userId: data.userId,
      voc: data.voc,
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
    const userId = data.userId;
    const recordCount = await VocsHistory.count({ where: { userId } });

    if (recordCount > 20) {
      const oldestRecord = await VocsHistory.findOne({
        where: { userId },
        order: [["createdAt", "ASC"]],
      });

      await VocsHistory.destroy({
        where: { userId, voc: oldestRecord.voc },
      });
    }
  } catch (error) {
    console.error("error");
    throw error;
  }
}

async function removeVoc(data) {
  return await VocsHistory.destroy({
    where: { userId: data.userId, voc: data.voc },
  });
}

module.exports = {
  listHistoryVocs,
  addVoc,
  removeVoc,
};
