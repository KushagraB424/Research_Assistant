import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./services/mongo.js";
import uploadRoutes from "./routes/upload.js";
import DOMMatrix from "dommatrix";
import path from "path";
import { fileURLToPath } from "url";
import chatRoutes from "./routes/chat.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// load env
dotenv.config({ path: path.join(__dirname, ".env") });

// required by pdf-parse
global.DOMMatrix = DOMMatrix;

const app = express();

// ✅ CORS MUST COME BEFORE ROUTES
app.use(
  cors({
    origin: "*",     // (later change to your frontend url)
    credentials: true
  })
);

// ✅ Support JSON bodies
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// 🟢 CONNECT DB
connectDB();

// 🟢 ROUTES
app.use("/api/upload", uploadRoutes);
app.use("/api/chat", chatRoutes);

// 🟢 HEALTH CHECK
app.get("/", (req, res) => res.send("API running"));

app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
  console.log("Server running on", process.env.PORT || 5000);
});
