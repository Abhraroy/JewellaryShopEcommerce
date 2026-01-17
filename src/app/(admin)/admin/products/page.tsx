"use client";

import Products from "../../../../components/AdminComponents/Products";
import { useState, useEffect } from "react";

export default function ProductsPage() {
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

  return <Products isDarkTheme={isDarkTheme} />;
}
