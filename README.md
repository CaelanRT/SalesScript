# 🧠 Sales Script Generator

A modern web application that generates personalized sales scripts using AI. This tool empowers sales professionals to craft effective outreach by leveraging intelligent language models tailored to specific buyer personas and product offerings.

---

## ✨ Features

- **Persona-Based Script Generation**  
  Create cold call or email scripts customized for a target persona: name, title, industry, pain points, and buying behavior.

- **Product Integration**  
  Include your product's key features, benefits, pricing, and value proposition.

- **Real-Time AI Output**  
  Scripts are generated live as you submit — fast feedback, zero lag.

- **Modern UI**  
  Built with Material-UI for a clean, responsive, and user-friendly interface.

- **Local AI Execution**  
  Uses [Ollama](https://ollama.com) with open-source models like LLaMA 3 for fast and private local inference — no API keys needed.

---

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- Material-UI
- Axios

### AI Integration
- Ollama (local LLM runner)
- LLaMA 3 (`llama3` model)

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm start

# 3. Make sure Ollama is running
ollama serve
```

> 🔗 Visit [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

## 🧑‍💼 How to Use

1. **Fill in Persona Details**
   - Full Name
   - Job Title
   - Industry
   - Pain Points
   - Decision-Making Process

2. **Enter Product Information**
   - Product Name
   - Key Features
   - Benefits
   - Price
   - Unique Value Proposition

3. **Click “Generate Script”**  
   - The app calls the local AI model and produces a custom script you can copy, edit, or export.

---

## 🧾 Project Structure

```
src/
├── App.tsx              # Main app component
├── theme.ts             # MUI theme customization
└── services/
    └── ollamaService.ts # Handles requests to local Ollama server
```

---

## 🙌 Contributing

1. Fork this repo  
2. Create your feature branch  
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes  
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. Push and open a pull request  

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for more details.

---

## 🙏 Acknowledgments

- [Ollama](https://ollama.com) – local LLM runtime
- [Material-UI](https://mui.com) – UI library
- [Meta’s LLaMA 3](https://ai.meta.com/llama) – open-source foundational model
- React + TypeScript – for powering the frontend experience

---

🔧 Built at a hackathon in 2025 — by sales pros, for sales pros.
