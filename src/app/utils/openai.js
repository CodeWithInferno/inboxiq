import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const generateText = async (prompt) => {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // Or "gpt-3.5-turbo" if available
      messages: [
        {
          role: "system", 
          content: "You are an email assistant."
        },
        {
          role: "user",
          content: prompt
        },
      ],
      max_tokens: 500, // Limit the response size
      temperature: 0.7, // Adjust for more/less randomness
    });

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    return "Error generating response.";
  }
};