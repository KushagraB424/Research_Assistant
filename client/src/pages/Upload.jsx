import { useState } from "react";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return setStatus("Please select a file");

    setStatus("Uploading...");

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        return setStatus("Error: " + data.error);
      }

      setStatus("Preview:\n\n" + data.preview);
    } catch (err) {
      console.error(err);
      setStatus("Network error");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Upload Research Papers (PDF)</h1>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow w-96">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Select PDF
          </label>

          <input type="file" accept="application/pdf" onChange={handleFileChange} />
        </div>

        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleUpload}
        >
          Upload
        </button>
        {status && (
          <pre className="mt-4 whitespace-pre-wrap text-gray-700 dark:text-gray-200">
            {status}
          </pre>
        )}
      </div>
    </div>
  );
}
