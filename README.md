# 🔐 CipherSpace

**Enterprise-Grade Password Generator & Secure Local Vault**

A high-performance, entirely client-side web app designed for power users who need robust, highly customizable password generation combined with a secure, offline-first storage vault. 

---

## 🌐 **Live Demo:** 

[cipher-space-shivansh.vercel.app](https://cipher-space-password-generator.vercel.app)

---

## ✨ Features

* 🎛️ **Granular Controls** — Fine-tune length (4–64 chars) and toggle lowercase, uppercase, numbers, and symbols.
* 🚫 **Smart Exclusions** — One-click toggles to remove ambiguous (`O`, `0`, `l`, `1`) or similar (`{}`, `[]`, `()`) characters.
* ✍️ **Custom Symbol Sets** — Override default special characters with your own specific string.
* 📊 **Real-Time Entropy** — Live calculation of password strength and entropy bits as you adjust parameters.
* 💾 **Secure Local Vault** — Save generated passwords directly to your browser; no databases, complete privacy.
* ⚙️ **Quick Presets** — Save and name your favorite parameter configurations for one-click loading.
* ⚡ **Keyboard Shortcuts** — Pro-level hotkeys: <kbd>Enter</kbd> to generate, <kbd>Ctrl</kbd>+<kbd>C</kbd> to copy, <kbd>Esc</kbd> to clear.
* 🛡️ **Custom Modals** — Native-feeling confirmation dialogs for destructive actions (e.g., purging the vault).

### 🧠 Security & Entropy Engine
CipherSpace calculates the mathematical strength of your passwords in real-time:
* 🧮 **Pool Size Calculation** — Dynamically counts the exact number of available characters based on your active toggles.
* 📏 **Entropy Bits** — Uses `log2(poolSize^length)` to give a mathematically accurate security score.
* 🚦 **Visual Strength Bar** — Translates raw entropy into a 4-tier visual scale (Weak ➔ Excellent).

---

## 🚀 How It Works

1. **User opens app**
2. **Adjusts parameters:** Sets length via slider/input and toggles character classes.
3. **App calculates** pool size and potential entropy instantly.
4. **User hits Generate** (or presses <kbd>Enter</kbd>).
5. **Password appears** in the stage-lit hero section.
6. **User copies** to clipboard or clicks **Save to Vault**.
7. **If saved**, the password + entropy score is stored securely in `localStorage`.
8. **Vault Tab** allows users to manage, copy, or purge saved credentials.

---

## 🎨 Design

* **Style:** Enterprise SaaS Dark Mode — stage-lit absolute blacks, precision glows, and sunken input fields.
* **Fonts:** Inter (UI & Navigation) + JetBrains Mono (Passwords & Data).
* **Animations:** Smooth fade-ins, scale-up modals, and custom tracking sliders.
* **Mobile First:** Fully responsive split-pane design that stacks perfectly on phones.

---

## 🛠️ Tech Stack

| Technology | Usage |
| :--- | :--- |
| **React 18** | Frontend framework |
| **Vite** | Build tool and dev server |
| **TypeScript** | Type-safe logic and component props |
| **Tailwind CSS** | Styling and custom UI system |
| **Zustand** | State management + `persist` middleware for Vault |
| **localStorage** | Offline-first database for Vault and Presets |
| **Google Fonts** | Inter + JetBrains Mono |

---

## 📁 Project Structure

```text
password-generator/
├── src/
│   ├── App.tsx             ← Main UI, layout, and view routing
│   ├── index.css           ← Tailwind directives & custom Enterprise styles
│   ├── main.tsx            ← React entry point
│   ├── lib/
│   │   └── password.ts     ← Core entropy math & generation engine
│   └── store/
│       └── useGenerator.ts ← Zustand state & localStorage persistence
├── index.html
├── tailwind.config.cjs
├── vite.config.ts
└── package.json
````

## ⚙️ Getting Started

### Prerequisites
* Node.js v18+
* npm v9+

### Installation

```bash
# Clone the repository
git clone [https://github.com/shivanshgupta01/password-generator.git](https://github.com/shivanshgupta01/password-generator.git)

# Navigate into the project
cd password-generator

# Install dependencies
npm install
````

### Run Locally

```bash
npm run dev
```

Open `http://localhost:5173` ✅

-----

## 🚀 Deployment on Vercel

### Step 1 — Push to GitHub

```bash
git add .
git commit -m "initial commit: CipherSpace"
git push origin main
```

### Step 2 — Deploy on Vercel

1.  Go to [vercel.com](https://www.google.com/search?q=https://vercel.com/) and import your repository.
2.  Vercel will automatically detect the Vite build settings.
3.  Click **Deploy** ✅ *(No environment variables needed\!)*

### Step 3 — Future Updates

Every time you make changes, just run:

```bash
git add .
git commit -m "your update message"
git push origin main
```

*Vercel auto-deploys in 30 seconds* ✅

-----

## 🔐 Security Notes

  * **100% Client-Side:** This application has no backend, no database, and makes zero network requests.
  * **Zero Tracking:** Your generated passwords, configurations, and vault items are never transmitted anywhere.
  * **Local Storage:** The Vault utilizes your browser's native `localStorage`. Clearing your browser data will permanently delete your vault.

-----

## 🗺️ Roadmap

  - [ ] Add Diceware / Passphrase generation mode (word lists)
  - [ ] Export/Import Vault as encrypted JSON
  - [ ] Implement "Copy & Clear after 30s" security feature
  - [ ] PWA support — installable on desktop and mobile
  - [ ] Optional: Add visual character distribution charts

-----

## 🏗️ Part of 30 Days Mini Projects

This app is **Day 08** of my 30 Days Mini Projects challenge — building one web app every day.

| Day | Project | Status |
| :--- | :--- | :--- |
| 01 | Daily Habit Tracker | ✅ Live |
| 02 | Skill Progress Tracker | ✅ Live |
| 03 | Focus Timer | ✅ Live |
| 04 | Accountability Board | ✅ Live |
| ... | ... | ... |
| 08 | **CipherSpace (Password Gen)** | ✅ Live |

-----

## 👨‍💻 Author

**Shivansh Gupta**

  * Instagram: [@flowkraftai](https://www.google.com/search?q=https://instagram.com/flowkraftai)
  * GitHub: [@shivanshgupta01](https://www.google.com/search?q=https://github.com/shivanshgupta01)
  * LinkedIn: [Shivansh Gupta](https://www.linkedin.com/in/shivanshfinance)

## 📄 License

[MIT License](https://www.google.com/search?q=LICENSE) — free to use, modify, and distribute.

-----

*Built with ❤️ by Shivansh Gupta* **⭐ Star this repo if you found it useful\!**

```
```
