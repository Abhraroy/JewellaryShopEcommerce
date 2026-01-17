"use client";

import Dashboard from "../../../../components/AdminComponents/Dashboard";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Sync theme with parent layout (could be improved with context)
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

  return <Dashboard isDarkTheme={isDarkTheme} />;
}
