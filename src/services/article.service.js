/**
 * @param {{voc: Array<Array<string>>}} data
 * @returns {Array<{
 *  title: string,
 *  content: string,
 *  voc: string,
 *  ans: Array<string>,
 *  correctAns: number,
 * }>}
 */
async function generateArticle(data) {
  // TODO: Synergize with chatGPT
  console.log(data.voc);
  return [];
}

module.exports = {
  generateArticle,
};
