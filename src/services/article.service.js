/**
 * @param {{vocs: Array<Array<string>>}} data
 */
async function generateArticle(data) {
  // TODO: Synergize with chatGPT
  console.log(data.vocs);
  return data.vocs;
}

module.exports = {
  generateArticle,
};
