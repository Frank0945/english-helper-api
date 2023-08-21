const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

/**
 * @param {string} voc
 */
async function callGPT(voc) {
  const prompt = `Now you are a college english professor, give me English article, the total length should be controlled within 200-250 words, and must contain the following words: ${voc}.
  Suitable for Taiwan college students reading.
  Generate 5 multiple-choice questions and base on article, 4 options for each question, and require correct answers(should be 1, 2, 3 or 4, only and always give number).
  Strictly abide by the following format rules below (brackets must exist, never add numbers or letters for options text), don't give me any suggestion: 
  [voc]${voc}
  [title]Generated title
  [content]Generated article
  [q1]question title
  [option1]option 1 text
  [option2]option 2 text
  [option3]option 3 text
  [option4]option 4 text
  [correct]correct answer number only(1~4)
  [q2] and so on...`;
  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    return chatCompletion.data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling the API:", error);
    throw error;
  }
}

module.exports = {
  callGPT,
};
