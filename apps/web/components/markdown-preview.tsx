"use client";

import MDEditor from "@uiw/react-md-editor";
import { useEffect, useState } from "react";

type MarkdownPreviewProps = {
  markdown: string;
};

export function MarkdownPreview({ markdown }: MarkdownPreviewProps) {
  const [colorMode, setColorMode] = useState<"dark" | "light">("dark");

  useEffect(() => {
    function sync() {
      const theme = document.documentElement.getAttribute("data-theme");
      setColorMode(theme === "light" ? "light" : "dark");
    }
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div data-color-mode={colorMode} className="markdown-viewer min-w-0 rounded-xl border border-border bg-surface">
      <MDEditor.Markdown source={markdown} style={{ backgroundColor: "transparent" }} />
    </div>
  );
}
