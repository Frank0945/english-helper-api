/* eslint-disable indent */
const { createQuiz } = require("../quiz.service");
const { callGPT } = require("./chatGPT.service");

/**
 * @param { Array<Array<string>> } data
 */
async function generateArticle(data, userId) {
  try {
    const promises = [];
    data.forEach((element) => {
      promises.push(callGPT(element.join(", ")));
    });

    const generatedArticles = await Promise.all(promises);

    const articles = [];

    generatedArticles.forEach((s, idx) => {
      const obj = { questions: [] };
      // s = s.replace(/(\n|\r|\r\n|↵)/g, "");
      obj.title = s.split("[title]")[1].split("[content]")[0].trim();
      obj.content = s.split("[content]")[1].split("[q1]")[0].trim();
      obj.voc = data[idx].join(", ");

      for (let i = 1; i < 6; i++) {
        obj.questions.push({});
        obj.questions[i - 1].question = s
          .split(`[q${i}]`)[1]
          .split("[option1]")[0]
          .trim();
        for (let j = 1; j < 5; j++) {
          const endSplit = j === 4 ? "[correct]" : `[option${j + 1}]`;
          obj.questions[i - 1]["option" + j] = s
            .split(`[option${j}]`)[1]
            .split(endSplit)[0]
            .trim();
        }
        obj.questions[i - 1].correct =
          i === 5
            ? Number(s.split(`[q${i}]`)[1].split("[correct]")[1].trim())
            : Number(
                s
                  .split(`[q${i}]`)[1]
                  .split("[correct]")[1]
                  .split(`[q${i + 1}]`)[0]
                  .trim()
              );
      }

      articles.push(obj);
    });

    const qIds = await createQuiz(articles, userId);
    articles.forEach((article) => {
      article.questions = article.questions.map((q) => ({
        qId: qIds.shift(),
        ...q,
      }));
    });
    return articles;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  generateArticle,
};
