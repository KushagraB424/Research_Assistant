import express from "express";
import multer from "multer";
import { createRequire } from "module";
import DOMMatrix from "dommatrix";
import Document from "../model/Document.js";
import { embedText } from "../services/embeddings.js";

global.DOMMatrix = DOMMatrix;
global.DOMPoint = DOMMatrix;
global.DOMRect = class {};

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // 1️⃣ extract text
    const pdfData = await pdfParse(req.file.buffer);
    const text = pdfData.text;

    // 2️⃣ chunk text
    const chunkSize = 800;
    let chunks = [];

    for (let i = 0; i < text.length; i += chunkSize) {
    const chunkText = text.slice(i, i + chunkSize);

    const embedding = await embedText(chunkText);

    chunks.push({
        text: chunkText,
        index: chunks.length,
        embedding
      });
    }
    // 3️⃣ save to MongoDB
    const doc = await Document.create({
      filename: req.file.originalname,
      chunks
    });

    // 4️⃣ 👇 THIS is where your return block goes
    return res.json({
      message: "Saved to database",
      id: doc._id,
      preview: text.slice(0, 500)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
