import { useEffect, useRef, useState } from "react";

const WELCOME = "¡Hola! Soy el asistente de **GO FIX MIAMI**. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre precios, servicios, marcas que reparamos o cómo contactarnos. 😊";

function BotAvatar() {
  return (
    <div className="lc-avatar">
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="#d4af37" fillOpacity="0.15" />
        <path d="M10 20c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="16" cy="11" r="3" stroke="#d4af37" strokeWidth="1.5" />
        <circle cx="11" cy="17" r="1" fill="#d4af37" />
        <circle cx="21" cy="17" r="1" fill="#d4af37" />
      </svg>
    </div>
  );
}

function renderText(text) {
  // Bold **text**
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : part
  );
}

export default function LiveChat() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || streaming) return;

    const userMsg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setStreaming(true);

    // Prepare history for API (exclude welcome which has no real API history)
    const apiMessages = newMessages
      .filter((m) => m.content !== WELCOME)
      .map((m) => ({ role: m.role, content: m.content }));

    // Add placeholder assistant message for streaming
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("http://localhost:4000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok) throw new Error("Server error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") break;
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: updated[updated.length - 1].content + parsed.text,
                };
                return updated;
              });
            }
          } catch {
            // ignore parse errors
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo o contáctanos por WhatsApp al +1 (786) 806-2197.",
        };
        return updated;
      });
    } finally {
      setStreaming(false);
      inputRef.current?.focus();
    }
  }

  const suggestions = [
    "¿Cuánto cuesta cambiar la pantalla de un iPhone?",
    "¿Reparan Samsung Galaxy?",
    "¿Cuánto demora una reparación?",
    "¿Tienen garantía?",
  ];

  const showSuggestions = messages.length === 1;

  return (
    <div className="lc-wrapper">
      <div className="lc-header">
        <BotAvatar />
        <div className="lc-header-info">
          <span className="lc-header-name">Asistente GO FIX MIAMI</span>
          <span className="lc-header-status">
            <span className="lc-status-dot" />
            En línea · IA
          </span>
        </div>
        <a
          href="https://wa.me/17868062197"
          target="_blank"
          rel="noopener noreferrer"
          className="lc-wa-btn"
          title="Abrir WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </div>

      <div className="lc-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`lc-msg lc-msg--${msg.role}`}>
            {msg.role === "assistant" && <BotAvatar />}
            <div className="lc-bubble">
              {msg.content
                ? renderText(msg.content)
                : <span className="lc-typing"><span /><span /><span /></span>}
            </div>
          </div>
        ))}
        {showSuggestions && (
          <div className="lc-suggestions">
            {suggestions.map((s) => (
              <button
                key={s}
                className="lc-suggestion"
                onClick={() => {
                  setInput(s);
                  inputRef.current?.focus();
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form className="lc-input-row" onSubmit={sendMessage}>
        <input
          ref={inputRef}
          className="lc-input"
          type="text"
          placeholder="Escribe tu pregunta..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={streaming}
          maxLength={500}
        />
        <button className="lc-send" type="submit" disabled={streaming || !input.trim()}>
          {streaming ? (
            <span className="lc-send-spinner" />
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}
