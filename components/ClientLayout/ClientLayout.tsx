"use client";

import { useViewPort } from "../../utils/useViewport";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  useViewPort();

  return <>{children}</>;
}
