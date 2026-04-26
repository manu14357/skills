"use client";

import { useState } from "react";

type CopyButtonProps = {
  value: string;
  className?: string;
  minimal?: boolean;
  onCopied?: () => Promise<void> | void;
};

export function CopyButton({ value, className = "", minimal = false, onCopied }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    if (onCopied) {
      await onCopied();
    }
    setTimeout(() => setCopied(false), 1200);
  }

  if (minimal) {
    return (
      <button
        type="button"
        onClick={handleCopy}
        title="Copy to clipboard"
        className={`shrink-0 rounded p-1 text-text-muted transition-colors hover:text-primary ${className}`}
      >
        {copied ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-text-muted transition hover:border-primary/50 hover:text-text-primary ${className}`}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
