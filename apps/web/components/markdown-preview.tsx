"use client";

import MDEditor from "@uiw/react-md-editor";
import { useEffect, useState, type MouseEvent } from "react";

type MarkdownPreviewProps = {
  markdown: string;
  onRelativeLinkClick?: (href: string) => void;
};

function isRelativeHref(href: string) {
  return !(href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:") || href.startsWith("#") || href.startsWith("/"));
}

export function MarkdownPreview({ markdown, onRelativeLinkClick }: MarkdownPreviewProps) {
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

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    if (!onRelativeLinkClick) return;
    const target = event.target as HTMLElement | null;
    const link = target?.closest("a");
    const href = link?.getAttribute("href");
    if (!href || !isRelativeHref(href)) return;
    event.preventDefault();
    onRelativeLinkClick(href);
  }

  return (
    <div
      data-color-mode={colorMode}
      className="markdown-viewer min-w-0 rounded-xl border border-border bg-surface"
      onClick={handleClick}
    >
      <MDEditor.Markdown source={markdown} style={{ backgroundColor: "transparent" }} />
    </div>
  );
}
