import { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("expert");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((m) => [...m, userMsg]);

    // placeholder response
    const reply = {
      role: "assistant",
      content: `This is a sample (${mode}) explanation.`
    };

    setMessages((m) => [...m, reply]);
    setInput("");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Research Chat</h2>

      <div className="mb-3">
        <label className="mr-2 font-medium">Explanation Mode:</label>
        <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="
                border rounded px-3 py-2
                bg-white text-gray-900 
                dark:bg-gray-700 dark:text-gray-100 
                dark:border-gray-600
                focus:outline-none focus:ring-2 focus:ring-blue-500 
                dark:focus:ring-blue-400
            "
            >

          <option value="expert">Expert</option>
          <option value="beginner">Beginner</option>
          <option value="child">Explain like I'm 10</option>
          <option value="analogy">Analogy</option>
        </select>
      </div>

      <div className="border rounded-lg bg-white p-4 h-80 overflow-y-auto shadow">
        {messages.map((m, i) => (
          <div key={i} className={`mb-2 ${m.role === "user" ? "text-blue-700" : "text-gray-800"}`}>
            <strong>{m.role === "user" ? "You" : "Assistant"}:</strong> {m.content}
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="
          border rounded flex-1 p-2
          bg-white text-gray-900
          dark:bg-gray-700 dark:text-gray-100
          dark:border-gray-600
          placeholder-gray-400 dark:placeholder-gray-300
          focus:outline-none focus:ring-2 focus:ring-blue-500 
          dark:focus:ring-blue-400
        "
        placeholder="Ask something..."
        />


        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
