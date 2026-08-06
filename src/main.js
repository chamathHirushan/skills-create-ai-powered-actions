const { rateJoke } = require("./rateJoke");
const core = require("@actions/core");

async function run() {
  // Get inputs
  const joke = core.getInput("joke", { required: true });
  const apiKey = process.env.GEMINI_API_KEY;

  // Rate the joke using Gemini Models
  const rating = await rateJoke(joke, apiKey);

  // Set the output
  core.setOutput("result", rating);
}

module.exports = { run };