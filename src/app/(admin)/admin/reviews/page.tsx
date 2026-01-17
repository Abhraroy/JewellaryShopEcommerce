"use client";

import { useState, useEffect } from "react";

export default function ReviewsPage() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      const body = document.body;
      setIsDarkTheme(body.classList.contains("dark") || 
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="p-6">
      <h1
        className={`text-3xl font-bold mb-6 ${
          isDarkTheme ? "text-white" : "text-gray-900"
        }`}
      >
        Reviews Management
      </h1>
      <div
        className={`${
          isDarkTheme ? "bg-black border border-gray-700" : "bg-white"
        } rounded-lg shadow p-6`}
      >
        <div
          className={`text-center py-12 ${
            isDarkTheme ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Reviews management interface will be implemented here
        </div>
      </div>
    </div>
  );
}
