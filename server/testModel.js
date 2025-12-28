import dotenv from "dotenv";
dotenv.config({ path: "./src/.env" });

const key = process.env.GEMINI_API_KEY;

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

const run = async () => {
  const res = await fetch(url);
  const data = await res.json();

  if (data.models) {
    data.models.forEach(m => console.log(m.name));
  } else {
    console.log("No models returned:", data);
  }
};

run();
