const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

/**
 * @param {string} voc
 */
async function callGPT(voc) {
  const prompt = `Generate English article, the total length should be controlled within 200-250 words, and must contain the following words: ${voc}, and suitable for Taiwan high school student reading. take the TOEIC test as the direction of the questions.
  generate 5 multiple-choice questions, 4 options for each question, and show corrected answer.  
  output as JSON format below:
  {
    "title":"",
    "content":"", 
    "questions":[
      {
        "question":"",
        "option1":"",
        "option2":"",
        "option3":"",
        "option4":"",
        "correct": 1~4
      },
      {
        "question":"",
        "option1":"",
        "option2":"",
        "option3":"",
        "option4":"",
        "correct": 1~4
      }
    ]
  }`;
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
