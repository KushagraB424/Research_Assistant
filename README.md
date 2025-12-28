# AI Research Assistant

A full-stack web app that lets you upload research PDFs and ask AI questions about them.

Your PDFs are processed into text → chunked → embedded → stored → semantically searched → then Gemini answers using only relevant document context.
To build trust and transparency, it also tells you where in the document the answer came from.

---

## Live Demo

### Frontend  
https://research-assistant-frontend-2cm4.onrender.com  

### Backend  
https://research-assistant-wheu.onrender.com  

---

## Features

-  Upload PDF research papers  
-  Extract and chunk PDF text  
-  Create embeddings using **Google Gemini embeddings**  
-  Store documents + embeddings in **MongoDB Atlas**  
-  Ask questions in multiple styles:
  - Expert  
  - Beginner  
  - Explain-to-a-Kid  
  - Analogy Mode  
-  AI answers grounded on your PDF
-  Light / Dark mode UI  
-  Fully deployed on **Render**

---

## Tech Stack

### Frontend
- React + Vite  
- TailwindCSS  
- Fetch API  

### Backend
- Node.js + Express  
- MongoDB + Mongoose  
- Google Gemini API  
- pdf-parse  
- dotenv  
- cors  

---

## Run Locally

### Clone repo

git clone https://github.com/KushagraB424/Research_Assistant.git

### Backend
cd server
npm install
npm start

Runs at:
http://localhost:5000

### Frontend

cd client
npm install
npm run dev

Runs at:
http://localhost:5173

###  Credits

Built by Kushagra Gupta
