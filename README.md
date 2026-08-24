Markdown
# 🕉️ Sanatan Setu (सनातन सेतु)

> **Your Spiritual Bridge** — Connecting devotees with verified Vedic rituals, sacred ceremonies, and authenticated priests.

---

## 📌 Project Overview

**Sanatan Setu** is a cross-platform mobile application designed to bridge traditional Vedic practices with modern digital convenience. The platform enables devotees to book verified priests, organize rituals and pujas at home, and access authentic spiritual services with transparency and trust.

---

## ✨ Key Features

* **3D Immersive Design System:** Rich, sacred visual aesthetics featuring dynamic depth, blur layers, and gold-accented styling.
* **Secure Phone Authentication:** Passwordless mobile login via Supabase OTP verification.
* **Cross-Platform Compatibility:** Optimized for both Android and iOS with native performance.
* **Responsive Architecture:** Scalable layout adapting across mobile screens and tablet formats.
* **Bilingual Support (Roadmap):** Designed for seamless switching between English and Hindi.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (Router v4) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling & UI** | React Native StyleSheet, BlurView, Vector Icons |
| **Backend & Auth** | [Supabase](https://supabase.com/) (PostgreSQL & OTP Authentication) |
| **State & Storage** | React Native Async Storage |

---

## 🚀 Getting Started

Follow these instructions to run the project locally on your machine.

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
* [Expo Go](https://expo.dev/go) app on your mobile device (iOS/Android)

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/VishnuHi-q/sanatan-setu.git](https://github.com/VishnuHi-q/sanatan-setu.git)
   cd sanatan-setu
Install dependencies:

Bash
npm install
Configure Environment Variables:
Create a .env file in the root directory:

Code snippet
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
Start the development server:

Bash
npx expo start
Run the app:

Scan the QR code using the Expo Go app on Android or the default Camera app on iOS.

Press w in the terminal to open the web preview.

📂 Project Structure
Plaintext
sanatan-setu/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Authentication flow (Login, OTP verification)
│   │   ├── _layout.tsx      # Root application layout & routing
│   │   └── index.tsx        # Entry splash screen
│   ├── components/          # Reusable UI components
│   ├── constants/           # Global styles, colors, and theme tokens
│   ├── hooks/               # Custom React hooks
│   └── lib/
│       └── supabase.ts      # Supabase client configuration
├── assets/                  # Images, fonts, and icons
├── .env                     # Environment variables (git-ignored)
└── package.json             # Project dependencies and scripts
🔒 Security & Best Practices
Environment Isolation: All sensitive credentials and API endpoints are managed via environment variables and excluded from version control.

Row-Level Security (RLS): Supabase database tables are secured using fine-grained access policies.

Type Safety: Full TypeScript implementation across the codebase to ensure robust development.

📄 License
This project is licensed under the MIT License — see the LICENSE file for details.


After pasting this, just save the file (`Ctrl + S`), commit it, and sync it to GitHub!