"use client";

import React, { useState } from "react";
import { ButtonContext } from "react-aria-components";

export function Stepper({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState(0);

  return (
    <ButtonContext.Provider
      value={{
        slots: {
          increment: {
            onPress: () => setValue(value + 1),
          },
          decrement: {
            onPress: () => setValue(value - 1),
          },
        },
      }}
    >
      {children}
    </ButtonContext.Provider>
  );
}
