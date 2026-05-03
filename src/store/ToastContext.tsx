"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

// ── Context ───────────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextType>({
  success: () => {},
  error: () => {},
  info: () => {},
  warning: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

// ── Config per type ───────────────────────────────────────────────────────────
const CONFIG: Record<ToastType, { icon: React.ElementType; bg: string; border: string; icon_color: string; title_color: string }> = {
  success: {
    icon: CheckCircle2,
    bg: "bg-white",
    border: "border-emerald-200",
    icon_color: "text-emerald-500",
    title_color: "text-emerald-700",
  },
  error: {
    icon: AlertCircle,
    bg: "bg-white",
    border: "border-red-200",
    icon_color: "text-red-500",
    title_color: "text-red-700",
  },
  info: {
    icon: Info,
    bg: "bg-white",
    border: "border-blue-200",
    icon_color: "text-blue-500",
    title_color: "text-blue-700",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-white",
    border: "border-amber-200",
    icon_color: "text-amber-500",
    title_color: "text-amber-700",
  },
};

// ── Provider + Renderer ───────────────────────────────────────────────────────
let nextId = 0;
const DURATION = 4500;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback((type: ToastType, title: string, message?: string) => {
    const id = ++nextId;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => dismiss(id), DURATION);
  }, [dismiss]);

  const ctx: ToastContextType = {
    success: (t, m) => add("success", t, m),
    error:   (t, m) => add("error", t, m),
    info:    (t, m) => add("info", t, m),
    warning: (t, m) => add("warning", t, m),
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}

      {/* Portal-like fixed container */}
      <div
        aria-live="polite"
        className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none"
        style={{ maxWidth: "22rem", width: "100%" }}
      >
        {toasts.map((toast) => {
          const { icon: Icon, bg, border, icon_color, title_color } = CONFIG[toast.type];
          return (
            <div
              key={toast.id}
              className={`
                pointer-events-auto flex items-start gap-3 px-4 py-3.5
                ${bg} border ${border} rounded-2xl shadow-xl shadow-black/10
                animate-slide-in-right
              `}
            >
              {/* Icon */}
              <div className={`flex-shrink-0 mt-0.5 ${icon_color}`}>
                <Icon size={18} strokeWidth={2} />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-sm ${title_color}`}>{toast.title}</p>
                {toast.message && (
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{toast.message}</p>
                )}
              </div>

              {/* Dismiss */}
              <button
                onClick={() => dismiss(toast.id)}
                className="flex-shrink-0 text-slate-300 hover:text-slate-500 transition-colors cursor-pointer mt-0.5"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
