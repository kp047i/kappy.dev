import "../app/globals.css";

import type { Decorator, Preview } from "@storybook/nextjs";
import { ThemeProvider, useTheme } from "next-themes";
import React, { useEffect } from "react";
import type { ReactNode } from "react";

const withThemeProvider: Decorator = (Story, context) => {
  const theme = context.globals.theme as "light" | "dark";

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={theme}
      enableSystem={false}
      disableTransitionOnChange
    >
      <ThemeSynchronizer theme={theme} />
      <Story />
    </ThemeProvider>
  );
};

const preview: Preview = {
  globalTypes: {
    theme: {
      name: "テーマ",
      description: "ライト / ダーク",
      defaultValue: "light",
      toolbar: {
        icon: "mirror",
        items: [
          { value: "light", title: "ライト" },
          { value: "dark", title: "ダーク" },
        ],
      },
    },
  },
  decorators: [withThemeProvider],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;

function ThemeSynchronizer({ theme }: { theme: "light" | "dark" }): null {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(theme);
  }, [setTheme, theme]);

  return null;
}
