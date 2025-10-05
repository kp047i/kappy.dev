"use client";

import clsx from "clsx";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

const BUTTON_BASE =
  "flex h-9 w-9 items-center justify-center rounded-md border border-transparent text-sm transition-colors duration-200";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-1 items-center p-1 rounded-lg border shadow-sm backdrop-blur border-secondary-100/80 bg-overlay-100/90 dark:border-base-800/60 dark:bg-base-800/60">
      <ThemeToggleButton
        label="ライトモードに切り替える"
        isActive={theme === "light"}
        onClick={() => setTheme("light")}
      >
        <FiSun className="w-4 h-4" />
      </ThemeToggleButton>
      <ThemeToggleButton
        label="ダークモードに切り替える"
        isActive={theme === "dark"}
        onClick={() => setTheme("dark")}
      >
        <FiMoon className="w-4 h-4" />
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
