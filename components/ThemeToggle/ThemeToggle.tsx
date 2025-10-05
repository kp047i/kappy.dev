"use client";

import clsx from "clsx";
import { useTheme } from "next-themes";
import { useEffect, useState, type ReactNode } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

const BUTTON_BASE =
  "flex h-9 w-9 items-center justify-center rounded-md border border-transparent text-sm transition-colors duration-200";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 rounded-lg border border-secondary-100/80 bg-overlay-100/90 p-1 opacity-0 dark:border-base-800/60 dark:bg-base-800/60">
        <span className="h-9 w-9 rounded-md border border-transparent" />
        <span className="h-9 w-9 rounded-md border border-transparent" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border border-secondary-100/80 bg-overlay-100/90 p-1 shadow-sm backdrop-blur dark:border-base-800/60 dark:bg-base-800/60">
      <ThemeToggleButton
        label="ライトモードに切り替える"
        isActive={theme === "light"}
        onClick={() => setTheme("light")}
      >
        <FiSun className="h-4 w-4" />
      </ThemeToggleButton>
      <ThemeToggleButton
        label="ダークモードに切り替える"
        isActive={theme === "dark"}
        onClick={() => setTheme("dark")}
      >
        <FiMoon className="h-4 w-4" />
      </ThemeToggleButton>
    </div>
  );
}

type ThemeToggleButtonProps = {
  children: ReactNode;
  isActive: boolean;
  label: string;
  onClick: () => void;
};

function ThemeToggleButton({
  children,
  isActive,
  label,
  onClick,
}: ThemeToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        BUTTON_BASE,
        isActive
          ? "text-white shadow-sm bg-primary-500"
          : "text-base-800 hover:bg-primary-50 hover:text-secondary-950 dark:text-base-100 dark:hover:bg-base-800 dark:hover:text-base-50"
      )}
      aria-pressed={isActive}
      aria-label={label}
    >
      {children}
    </button>
  );
}
