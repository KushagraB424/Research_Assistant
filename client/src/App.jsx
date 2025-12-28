import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [mode, setMode] = useState("expert");
  const [dark, setDark] = useState(false);

  const toggleDark = () => setDark(!dark);

  async function uploadPDF(e) {
    e.preventDefault();

    if (!file) {
      setStatus("Please select a PDF first");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    setStatus("Uploading & processing…");

    const res = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setStatus(data.message || "Uploaded");
  }

  async function ask() {
    setAnswer("Thinking…");

    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, mode }),
    });

    const data = await res.json();

    if (data.answer) setAnswer(data.answer);
    else setAnswer("Something went wrong");
  }

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">

        {/* Header */}
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">AI Research Assistant</h1>

          <button
            onClick={toggleDark}
            className="px-3 py-1 rounded bg-gray-800 text-white dark:bg-gray-200 dark:text-black"
          >
            {dark ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* ⭐ 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT COLUMN */}
          <div className="space-y-6">

            {/* Upload Panel */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
              <h2 className="font-semibold mb-3">Upload PDF</h2>

              <form onSubmit={uploadPDF} className="space-y-3">

                <div className="flex items-center gap-3 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded p-3">
                  <label className="px-3 py-1.5 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                    Choose File
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </label>

                  <span className="text-gray-800 dark:text-gray-200 text-sm">
                    {file ? file.name : "No file chosen"}
                  </span>
                </div>

                <button className="bg-green-600 text-white px-4 py-2 rounded">
                  Upload
                </button>

                {status && (
                  <pre className="mt-2 whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                    {status}
                  </pre>
                )}
              </form>
            </div>

            {/* Ask Panel */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
              <h2 className="font-semibold mb-3">Ask a Question</h2>

              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="border p-2 rounded dark:bg-gray-700 dark:text-white"
              >
                <option value="expert">Expert</option>
                <option value="beginner">Beginner</option>
                <option value="kid">Explain to a 10-year-old</option>
                <option value="analogy">Analogy Mode</option>
              </select>

              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask something…"
                className="border p-2 rounded w-full mt-3 dark:bg-gray-700 dark:text-white"
              />

              <button
                onClick={ask}
                className="bg-blue-600 text-white px-4 py-2 rounded mt-3"
              >
                Ask
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN — ALWAYS OCCUPIES SPACE */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow min-h-[300px]">
            <h2 className="font-semibold mb-3">Answer</h2>

            {answer ? (
              <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                {answer}
              </pre>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                Ask a question to see the response here…
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

}

export default App;
