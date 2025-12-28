import express from "express";
import Document from "../model/Document.js";
import { embedText } from "../services/embeddings.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const pkg = require("@google/generative-ai/package.json");

console.log("SDK version:", pkg.version);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "models/gemini-flash-latest"
});


const router = express.Router();

function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

router.post("/", async (req, res) => {
  try {
    console.log("👉 Chat request received:", req.body);

    const { question, mode = "expert" } = req.body;

    console.log("👉 Embedding question...");
    const qEmbed = await embedText(question);

    console.log("👉 Loading documents...");
    const docs = await Document.find();

    console.log("👉 Computing similarities...");

    let scored = [];

    docs.forEach(doc => {
      doc.chunks.forEach(chunk => {
        if (chunk.embedding && chunk.embedding.length) {
          const score = cosineSimilarity(qEmbed, chunk.embedding);
          scored.push({
            score,
            text: chunk.text,
            source: doc.filename
          });
        }
      });
    });

    scored.sort((a, b) => b.score - a.score);

    const top = scored.slice(0, 5);

    let context = top
      .map((c, i) => `Source ${i + 1} (${c.source}):\n${c.text}`)
      .join("\n\n");

    const modeInstructions = {
      beginner: "Explain in simple language for a beginner.",
      expert: "Explain concisely with technical depth.",
      kid: "Explain like I am 10 years old.",
      analogy: "Explain using analogies and real-life examples."
    };

    const style = modeInstructions[mode] || modeInstructions.expert;

    const prompt = `
You are a research assistant. Answer the user's question based ONLY on the provided sources.
Cite sources like: (Source 1), (Source 2)

${style}

QUESTION:
${question}

SOURCES:
${context}
`;

    const result = await model.generateContent(prompt);

    return res.json({
      answer: result.response.text(),
      sources: top
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chat failed" });
  }
});

export default router;