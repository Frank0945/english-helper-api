/**
 * @param {{vocs: Array<Array<string>>}} data
 * @returns {Array<{
 *  title: string,
 *  content: string,
 *  vocs: string,
 *  ans: Array<string>,
 *  correctAns: number,
 * }>}
 */
async function generateArticle(data) {
  // TODO: Synergize with chatGPT
  console.log(data.vocs);
  return [];
}

module.exports = {
  generateArticle,
};
