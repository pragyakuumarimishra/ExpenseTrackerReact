# PExpense Pro 💸

A modern, multi-user cloud-based expense tracker built with React, Firebase, Chart.js, and Tailwind CSS. Features authentication, real-time data, analytics, dark mode, and more.

---

## 🚀 Features

- 🔐 **Authentication** (Sign up, Login, Logout with Firebase Auth)
- 🧾 **Expense Management** (Add, edit, delete expenses per user)
- 📅 **Date Filtering** (Filter expenses by month)
- 🏷️ **Category Dropdown** (Choose from common categories)
- 💡 **Dark Mode** (Toggle with a floating button, persists preference)
- 📊 **Analytics** (Pie chart of expenses by category)
- 💰 **Monthly Budget Alerts** (Set a budget, get alerts if exceeded)
- 📤 **Export to CSV** (Download filtered expenses)
- 📱 **Responsive Design** (Mobile-friendly UI)

---

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Firebase Auth & Firestore
- **Charts:** Chart.js (react-chartjs-2)

---

## 📦 Installation & Setup

1. **Clone the repo:**
   ```bash
   git clone <your-repo-url>
   cd pexpense-pro
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure Firebase:**
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com/)
   - Enable Email/Password Auth and Firestore
   - Copy your config to `src/firebase/config.js`:
     ```js
     export const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       // ...
     };
     ```
4. **Start the app:**
   ```bash
   npm start
   ```
   The app will run at [http://localhost:3000](http://localhost:3000)

---

## 🌗 Dark Mode
- Click the floating "Toggle Dark/Light Mode" button at the bottom-right to switch themes.
- Your preference is saved and persists across reloads.

---

## 📊 Analytics & Export
- View a pie chart of your expenses by category.
- Filter expenses by month.
- Set a monthly budget and get alerts if you exceed it.
- Export your filtered expenses to CSV with one click.

---

## 📱 Responsive Design
- The app is fully responsive and works great on mobile and desktop.

---

## 📝 License
MIT

---

## 🙏 Credits
- [React](https://reactjs.org/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Chart.js](https://www.chartjs.org/)
