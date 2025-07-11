import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <button
      className="px-4 py-2 bg-gray-800 text-white rounded fixed bottom-4 right-4 z-50 shadow-lg dark:bg-gray-200 dark:text-gray-900"
      onClick={() => setDarkMode((d) => !d)}
    >
      Toggle {darkMode ? "Light" : "Dark"} Mode
    </button>
  );
} 