import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiCpu, FiSend } from "react-icons/fi";
import { assistantSuggestions } from "../../data/dashboardData.js";
import { sendAIChatMessage } from "../../services/api.js";

const initialMessages = [
  {
    id: 1,
    role: "assistant",
    text: "I can help prioritize regions, explain pest risk, and draft farmer advisories from the latest crop signals.",
    time: "09:42",
  },
  {
    id: 2,
    role: "user",
    text: "Summarize the three regions needing immediate intervention.",
    time: "09:43",
  },
  {
    id: 3,
    role: "assistant",
    text: "Guntur, Nellore, and Warangal need attention. Guntur has critical chilli pest pressure, Nellore shows fungal spread after rainfall, and Warangal needs cotton bollworm scouting.",
    time: "09:43",
  },
];

function TypingIndicator() {
  return (
    <div className="flex max-w-[86%] items-center gap-2 rounded-3xl rounded-tl-md bg-slate-100 p-4 dark:bg-slate-800">
      <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-600" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-600 [animation-delay:120ms]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-600 [animation-delay:240ms]" />
    </div>
  );
}

function AIAssistantWidget() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  async function sendMessage(text = input) {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMsg = { id: Date.now(), role: "user", text: trimmed, time };
    setMessages((current) => [...current, userMsg]);
    setInput("");
    setTyping(true);

    try {
      const reply = await sendAIChatMessage(trimmed, messages);
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: reply,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setTyping(false);
    }
  }

  return (
    <article className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-xl shadow-emerald-950/5 dark:border-emerald-900/50 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-700 text-white shadow-lg shadow-emerald-700/25">
          <FiCpu />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Copilot
          </p>
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
            AI Assistant
          </h2>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="mt-5 max-h-[420px] space-y-3 overflow-y-auto rounded-3xl bg-slate-50 p-3 dark:bg-slate-950"
      >
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`max-w-[88%] ${
              message.role === "user" ? "ml-auto text-right" : ""
            }`}
          >
            <div
              className={`rounded-3xl p-4 text-sm leading-6 ${
                message.role === "user"
                  ? "rounded-tr-md bg-emerald-700 text-white"
                  : "rounded-tl-md bg-white text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-200"
              }`}
            >
              {message.text}
            </div>
            <p className="mt-1 px-2 text-[11px] font-semibold text-slate-400">
              {message.time}
            </p>
          </motion.div>
        ))}
        {typing && <TypingIndicator />}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {assistantSuggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => sendMessage(suggestion)}
            className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:-translate-y-0.5 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-200 dark:hover:bg-emerald-900"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage();
        }}
        className="mt-5 flex items-center gap-2 rounded-2xl border border-emerald-100 bg-slate-50 p-2 dark:border-emerald-900/50 dark:bg-slate-950"
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-slate-400 dark:text-white"
          placeholder="Ask AI about crops..."
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-700 text-white shadow-lg shadow-emerald-700/25"
        >
          <FiSend />
        </motion.button>
      </form>
    </article>
  );
}

export default AIAssistantWidget;
