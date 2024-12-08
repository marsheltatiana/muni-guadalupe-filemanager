"use client"

import { useEffect } from "react";

const DOCUMENTATION_URL = "https://muni-guadalupe-filemanager-documentacion.vercel.app/";

const KeyPressListener = () => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Cambia 'KeyO' por la tecla que deseas
      if (event.code === "F1") {
        window.open(DOCUMENTATION_URL, "_blank"); // URL que quieres abrir
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return null;
};

export default KeyPressListener;
