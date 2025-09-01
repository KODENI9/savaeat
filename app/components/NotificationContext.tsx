"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Notification = {
  id: number;
  type: "success" | "error" | "info";
  message: string;
};

type NotificationContextType = {
  notify: (type: Notification["type"], message: string) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = (type: Notification["type"], message: string) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000); // Disparaît après 3s
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}

      {/* Zone d'affichage */}
      <div className="fixed top-4 right-4 space-y-3 z-50">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-xl shadow-lg text-white animate-fade-in-down ${
              n.type === "success"
                ? "bg-green-500"
                : n.type === "error"
                ? "bg-red-500"
                : "bg-blue-500"
            }`}
          >
            {n.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotification doit être utilisé dans un NotificationProvider");
  return context;
}
