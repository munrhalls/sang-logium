"use client";

import React from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    return <>{styles}</>;
  });
  // Only run on server
  if (typeof window !== "undefined") {
    return <>{children}</>;
  }

  const styledComponentsStyleSheet = new ServerStyleSheet();

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  );
}
