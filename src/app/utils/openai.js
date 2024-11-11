// import { Configuration, OpenAIApi } from "openai";

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(configuration);

// export const generateText = async (prompt) => {
//   try {
//     const response = await openai.createChatCompletion({
//       model: "gpt-3.5-turbo", // Or "gpt-3.5-turbo" if available
//       messages: [
//         {
//           role: "system", 
//           content: "You are an email assistant."
//         },
//         {
//           role: "user",
//           content: prompt
//         },
//       ],
//       max_tokens: 500, // Limit the response size
//       temperature: 0.7, // Adjust for more/less randomness
//     });

//     return response.data.choices[0].message.content.trim();
//   } catch (error) {
//     console.error("Error with OpenAI API:", error);
//     return "Error generating response.";
//   }
// };
















// src/utils/openai.js

import OpenAI from 'openai';

// Initialize OpenAI instance with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Function to classify email content based on a user-defined prompt.
 * @param {string} content - The email content to be classified.
 * @param {string} prompt - The classification prompt provided by the user.
 * @returns {string} - The classification result from OpenAI's response.
 */
export async function classifyEmailContent(content, prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an email classifier.' },
        { role: 'user', content: `${prompt}: ${content}` },
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error classifying email content:', error);
    throw new Error('Classification failed');
  }
}
