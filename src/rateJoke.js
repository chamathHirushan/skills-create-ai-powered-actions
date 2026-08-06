const { GoogleGenAI } = require("@google/genai");

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
  });

  return response.text;
}

module.exports = { rateJoke };