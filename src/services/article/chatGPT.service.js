const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

/**
 * @param {string} voc
 */
async function callGPT(voc) {
  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      messages: [
        { role: "system", content: sysMsg },
        { role: "user", content: userMsg },
        { role: "assistant", content: assistantMsg },
        { role: "user", content: voc },
      ],
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

const sysMsg = `You are a college english professor, you need to write a English reading comprehension, including title, article and 5 multiple-choice questions and base on article, 4 options for each question, and require correct answers (should be 1, 2, 3 or 4, only and always give number), the total number of words in the article must be within 200-250 words, and must contain the words that user provide and strictly abide by the following format rules below (brackets must exist, never add extra space, never add numbers or letters for options text).
Strictly abide by the following format rules below (brackets must exist, never add numbers or letters for options text), don't give me any suggestion.
[title]Generated title
[content]Generated article
[q1]question title
[option1]option 1 text
[option2]option 2 text
[option3]option 3 text
[option4]option 4 text
[correct]correct answer number only(1~4)
[q2]and so on...
`;

const userMsg = "Britain, study, conclusion, obvious, improve";

const assistantMsg = `[title]Learning English
[content]Today, millions of people want to learn or improve their English but it is difficult to find the best method. Is it better to study in Britain or America or to study in your own country?

The advantages of going to Britain seem obvious. Firstly, you will be able to listen to the language all the time you are in the country. You will be surrounded completely by the language wherever you go. Another advantage is that you have to speak the language if you are with other people. In Italy, it is always possible, in the class, to speak Italian if you want to and the learning is slower.

On the other hand, there are also advantages to staying at home to study. You don't have to make big changes to your life. As well as this, it is also a lot cheaper than going to Britain but it is never possible to achieve the results of living in the UK. If you have a good teacher in Italy, I think you can learn in a more concentrated way than being in Britain without going to a school.

So, in conclusion, I think that if you have enough time and enough money, the best choice is to spend some time in the UK. This is simply not possible for most people, so being here in Italy is the only viable option. The most important thing to do in this situation is to maximise your opportunities: to speak only English in class and to try to use English whenever possible outside the class.
[q1]What is the article about?
[option1]How many people learn English.
[option2]The best way to learn English.
[option3]English schools in England and America.
[option4]The history of the English language.
[correct]2
[q2]What is one of the advantages of going to the UK to learn English?
[option1]There are no Italians in Britain.
[option2]You will have to speak English and not your language.
[option3]The language schools are better.
[option4]The cost of living is lower in the UK.
[correct]2
[q3]What is one of the advantages of staying in your country to learn English?
[option1]The teachers aren't very good in Britain.
[option2]You have to work too hard in Britain.
[option3]Your life can continue more or less as it was before.
[correct]3
[option4]The language resources are limited in your country.
[q4]People who don't have a lot of time and money should...
[option1]Learn English in Britain.
[option3]Go to Italy to learn English.
[option4]Consider online language courses.
[correct]2
[q5]What is an advantage of language schools in England or America, as suggested in the article?
[option1]Lack of diversity among students.
[option2]Fewer opportunities to practice outside the classroom.
[option3]Lower educational standards compared to local institutions.
[option4]Requirement to speak and use English consistently.
[correct]4`;
