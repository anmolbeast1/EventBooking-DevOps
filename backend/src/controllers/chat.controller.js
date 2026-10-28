const OLLAMA_URL = "http://127.0.0.1:11434/api/chat";
const MODEL = "llama3.2";

export const chatWithAI = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (
      typeof message !== "string" ||
      !message.trim() ||
      message.length > 500
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a message of up to 500 characters.",
      });
    }

    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        stream: false,
        messages: [
          {
            role: "system",
            content:
              "You are the helpful AI assistant for EventBooking, an event discovery and ticket booking website. Help users discover events and understand bookings. Be friendly and concise. Never invent event names, dates, locations, prices, availability, booking status, or refund policies. You do not have access to the website database, so explain when specific information cannot be verified.",
          },
          {
            role: "user",
            content: message.trim(),
          },
        ],
      }),
      signal: AbortSignal.timeout(120000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Ollama error:", errorText);

      return res.status(502).json({
        success: false,
        message: "The local AI model could not process your request.",
      });
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      reply: data.message?.content || "Sorry, I couldn't generate a reply.",
    });
} catch (error) {
  console.error("Chatbot connection error:", error);
  console.error("Underlying cause:", error.cause);
  next(error);
}
};
