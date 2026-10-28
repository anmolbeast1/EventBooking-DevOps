
import { useState } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import "./Chatbot.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"
).replace(/\/$/, "");

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

const FAQ_QUESTIONS = [
  "How can I find events?",
  "How do I book tickets?",
  "How can I view my bookings?",
  "How do I cancel a booking?",
  "What payment methods are supported?",
  "How can I contact support?",
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hi! I'm your EventSphere assistant. Choose a common question below or type your own question.",
    },
  ]);

  async function sendMessage(text = message) {
    const question = text.trim();

    if (!question || loading) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: question },
    ]);

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: question }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Chat request failed"
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.reply || "No answer received.",
        },
      ]);
    } catch (err) {
      console.error("Chatbot request failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the chatbot server."
      );
    } finally {
      setLoading(false);
    }
  }

  const showFAQs = messages.length === 1 && !loading;

  return (
    <div className="chatbot-widget">
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <Bot size={24} />
              <div>
                <h3>EventSphere Assistant</h3>
                <span>Ask about events and bookings</span>
              </div>
            </div>

            <button
              type="button"
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              <X size={22} />
            </button>
          </div>

          <div className="chatbot-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.role}`}
              >
                {msg.text}
              </div>
            ))}

            {showFAQs && (
              <div className="chatbot-faqs">
                <p>Frequently asked questions</p>

                {FAQ_QUESTIONS.map((question) => (
                  <button
                    type="button"
                    key={question}
                    className="chatbot-faq-button"
                    disabled={loading}
                    onClick={() => void sendMessage(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="chat-message assistant">
                Thinking...
              </div>
            )}

            {error && (
              <p role="alert" className="chat-error">
                {error}
              </p>
            )}
          </div>

          <form
            className="chatbot-input-area"
            onSubmit={(e) => {
              e.preventDefault();
              void sendMessage();
            }}
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about events..."
              maxLength={500}
              disabled={loading}
              aria-label="Type your message"
            />

            <button
              type="submit"
              disabled={loading || !message.trim()}
              aria-label="Send message"
            >
              <Send size={19} />
            </button>
          </form>
        </div>
      )}

      
      <button
        type="button"
        className="chatbot-toggle"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X size={27} /> : <MessageCircle size={27} />}
      </button>
    </div>
  );
}
