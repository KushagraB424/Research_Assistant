import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema({
  text: String,
  index: Number,
  embedding: { type: [Number], default: [] }
});

const documentSchema = new mongoose.Schema({
  filename: String,
  uploadedAt: { type: Date, default: Date.now },
  chunks: [chunkSchema]
});

export default mongoose.model("Document", documentSchema);
