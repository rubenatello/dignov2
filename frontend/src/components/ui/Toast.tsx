"use client";
import React, { useEffect, useState } from "react";

type ToastMessage = {
  id: number;
  text: string;
  type?: "success" | "error" | "info";
};

let listeners: ((msg: Omit<ToastMessage, "id">) => void)[] = [];

export function toast(text: string, type: ToastMessage["type"] = "info") {
  listeners.forEach((l) => l({ text, type }));
}

export function ToastContainer() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handler = (msg: Omit<ToastMessage, "id">) => {
      const id = Date.now() + Math.random();
      const full: ToastMessage = { id, ...msg };
      setMessages((prev) => [...prev, full]);
      setTimeout(() => {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }, 2600);
    };
    listeners.push(handler);
    return () => {
      listeners = listeners.filter((l) => l !== handler);
    };
  }, []);

  return (
    <div style={{
      position: "fixed",
      top: 16,
      right: 16,
      zIndex: 2000,
      display: "flex",
      flexDirection: "column",
      gap: 8,
    }}>
      {messages.map((m) => (
        <div
          key={m.id}
          style={{
            background: m.type === "success" ? "#16a34a" : m.type === "error" ? "#dc2626" : "#334155",
            color: "white",
            padding: "10px 14px",
            borderRadius: 8,
            boxShadow: "0 6px 20px rgba(0,0,0,.2)",
            fontSize: 14,
            maxWidth: 360,
          }}
        >
          {m.text}
        </div>
      ))}
    </div>
  );
}
