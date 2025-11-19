import axios from "axios";

const geminiResponse = async (command, assistantName, userName) => {
  try {
    // ✅ Use only the API key in your .env file
    const apiKey = process.env.GEMINI_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    // ✅ The system prompt
    const prompt = `
You are a smart virtual assistant named ${assistantName}, created by ${userName}.
Your task is to understand the user's command and respond **only** with a JSON object:

{
  "type": "general" | "google_search" | "youtube_search" | "youtube_play" | "get_time" | "get_date" | "get_day" | "get_month" | "calculator_open" | "instagram_open" | "facebook_open" | "weather_show",
  "userinput": "<user's original input, cleaned if needed>",
  "response": "<a short natural language reply>"
}

Rules:
- Always output valid JSON only, no explanations, no markdown.
- Use "${userName}" if someone asks who created you.
- Choose "type" based on user intent.
- "response" should be a natural spoken phrase, e.g., "Here\'s what I found" or "It\'s 5 PM".
- If uncertain, default to "general".
- if someone ask you general question that you already know then give them immedietly a short answer.

Now, the user said: "${command}"
`;

    // ✅ Call Gemini API
    const response = await axios.post(apiUrl, {
      contents: [{ parts: [{ text: prompt }] }],
    });

    // ✅ Safely extract text
    const textResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("🔹 Gemini raw output:", textResponse);

    // ✅ Try to extract JSON (some models may add noise)
    const jsonMatch = textResponse.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      console.warn("⚠️ No valid JSON found in Gemini output");
      return {
        type: "general",
        userinput: command,
        response: "Sorry, I couldn't understand that.",
      };
    }

    // ✅ Parse and return the clean JSON
    const parsed = JSON.parse(jsonMatch[0]);
    return parsed;

  } catch (error) {
    console.error("❌ Error in Gemini API Block:", error.message);
    if (error.response) {
      console.error("Gemini API Response:", error.response.data);
    }
    return {
      type: "general",
      userinput: command,
      response: "Something went wrong while processing your request.",
    };
  }
};

export default geminiResponse;
