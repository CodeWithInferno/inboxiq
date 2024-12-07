// import { Configuration, OpenAIApi } from "openai";

// const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

// export default async function handler(req, res) {
//   const { text } = req.body;

//   try {
//     const completion = await openai.createCompletion({
//       model: "text-davinci-003",
//       prompt: `Identify grammar and spelling errors in the text and suggest corrections: ${text}`,
//       max_tokens: 1000,
//     });

//     const suggestions = JSON.parse(completion.data.choices[0].text);
//     res.status(200).json({ suggestions });
//   } catch (error) {
//     console.error("Error fetching grammar suggestions:", error);
//     res.status(500).json({ error: "Failed to fetch suggestions." });
//   }
// }
