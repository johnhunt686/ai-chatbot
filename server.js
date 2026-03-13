import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


// System prompt + conversation history
let conversation = [
  {
    role: "system",
    content: "You are a proof of concept chatbot used to demonstrate interacting with an api, be chatty and personable"
  }
];


app.post("/chat", async (req, res) => {
  const { message } = req.body;

  // store user message
  conversation.push({
    role: "user",
    content: message
  });

  try {
    const response = await openai.responses.create({
      model: "gpt-3.5-turbo",
      input: conversation
    });

    const reply = response.output_text;

    // store assistant reply
    conversation.push({
      role: "assistant",
      content: reply
    });

    res.json({
      reply: reply
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "AI request failed." });
  }
});


app.listen(3000, () => {
  console.log("Server running on port 3000");
});