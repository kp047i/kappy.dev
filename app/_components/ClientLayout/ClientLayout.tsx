"use client";

import { useViewPort } from "../../_utils/useViewport";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  useViewPort();

  return <>{children}</>;
}
