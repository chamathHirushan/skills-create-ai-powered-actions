const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

const JokeRatingSchema = z.object({
  is_joke: z.boolean().describe(
    "Whether the input is actually a joke or attempt at humor"
  ),
  score: z.number().min(1).max(10).nullable().describe(
    "Rating from 1-10, where 10 is the funniest"
  ),
  humor_type: z.string().nullable().describe(
    "The type of humor (e.g., pun, wordplay, dad joke, dark, etc)"
  ),
  feedback: z.string().nullable().describe(
    "Short feedback on the joke's strengths and weaknesses"
  ),
});

async function rateJoke(joke, token) {
  const client = new GoogleGenAI({
    apiKey: token,
  });

  const response = await client.models.generateContent({
    model: process.env.MODEL || "gemini-3-flash-preview",
    contents: `Please rate this joke: "${joke}"`,
    config: {
      systemInstruction:
        "You are a helpful assistant that evaluates jokes. Assess whether the input is actually a joke, and if so, rate its humor quality, creativity, and delivery. Respond briefly and include a numeric overall rating from 0–10.",
    },
    responseMimeType: "application/json",
    responseSchema: { //response_format for github models gpt 4
      type: "OBJECT",
      properties: {
        is_joke: {
          type: "BOOLEAN",
          description:
            "Whether the input is actually a joke or attempt at humor",
        },
        score: {
          type: "NUMBER",
          description:
            "Rating from 1-10, where 10 is the funniest",
        },
        humor_type: {
          type: "STRING",
          description:
            "The type of humor",
        },
        feedback: {
          type: "STRING",
          description:
            "Short feedback on the joke",
        },
      },
      required: [
        "is_joke",
        "score",
        "humor_type",
        "feedback",
      ],
    },
  });

  // Gemini returns JSON text, so parse it
  const parsedJSON = JSON.parse(response.text);

  // Validate using Zod
  return JokeRatingSchema.parse(parsedJSON);
}

module.exports = { rateJoke };