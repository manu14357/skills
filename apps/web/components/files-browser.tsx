"use client";

import { useEffect, useState } from "react";
import { CopyButton } from "./copy-button";
import { MarkdownPreview } from "./markdown-preview";

type FileNode = {
  type: "file" | "dir";
  name: string;
  path: string;
  size?: number;
  download_url?: string | null;
};

type FilesBrowserProps = {
  skillSlug: string;
  openPath?: string | null;
};

export function FilesBrowser({ skillSlug, openPath }: FilesBrowserProps) {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ name: string; path: string }>>([
    { name: "Root", path: "" }
  ]);

  useEffect(() => {
    loadFilesAtPath("");
  }, [skillSlug]);

  useEffect(() => {
    if (!openPath) return;
    void openRelativeLink(openPath, "");
  }, [openPath]);

  async function loadFilesAtPath(folderPath: string): Promise<FileNode[]> {
    try {
      setLoading(true);
      let url = `/api/skills/${skillSlug}/files`;
      if (folderPath) {
        url += `?path=${encodeURIComponent(folderPath)}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to load files");
      }
      const data = (await response.json()) as FileNode[];
      // Filter out .DS_Store and other system files
      const filtered = data.filter((f) => !f.name.startsWith("."));
      setFiles(filtered);
      setSelectedFile(null);
      setFileContent("");
      setCurrentPath(folderPath);

      // Update breadcrumbs
      if (folderPath === "") {
        setBreadcrumbs([{ name: "Root", path: "" }]);
      } else {
        const parts = folderPath.split("/");
        const crumbs = [{ name: "Root", path: "" }];
        let currentBreadcrumb = "";
        parts.forEach((part) => {
          currentBreadcrumb = currentBreadcrumb ? `${currentBreadcrumb}/${part}` : part;
          crumbs.push({ name: part, path: currentBreadcrumb });
        });
        setBreadcrumbs(crumbs);
      }
      return filtered;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load files");
      setFiles([]);
      return [];
    } finally {
      setLoading(false);
    }
  }

  async function loadFileContent(file: FileNode) {
    if (file.type === "dir") {
      // Open the folder
      const newPath = currentPath ? `${currentPath}/${file.name}` : file.name;
      await loadFilesAtPath(newPath);
      return;
    }

    try {
      setContentLoading(true);
      // Extract the relative path from skills/skillName/actualPath
      const parts = file.path.split("/");
      const relativePath = parts.slice(2).join("/"); // Skip 'skills' and skill name
      const response = await fetch(`/api/skills/${skillSlug}/file/${relativePath}`);
      if (!response.ok) {
        throw new Error("Failed to load file content");
      }
      const content = await response.text();
      setSelectedFile(file);
      setFileContent(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load file content");
      setFileContent("");
    } finally {
      setContentLoading(false);
    }
  }

  const getFileIcon = (name: string, type: string) => {
    if (type === "dir") return "📂";
    if (name.endsWith(".md")) return "📝";
    if (name.endsWith(".py")) return "🐍";
    if (name.endsWith(".js") || name.endsWith(".tsx") || name.endsWith(".ts") || name.endsWith(".jsx")) return "⚙️";
    if (name.endsWith(".json")) return "⚙️";
    if (name.endsWith(".yml") || name.endsWith(".yaml")) return "⚙️";
    if (name.endsWith(".sh")) return "🔧";
    return "📄";
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  function normalizeLinkPath(href: string) {
    const withoutHash = href.split("#")[0] || "";
    const withoutQuery = withoutHash.split("?")[0] || "";
    return withoutQuery.replace(/^\.\//, "").replace(/^\/+/, "");
  }

  function resolveRelativePath(baseDir: string, href: string) {
    const cleaned = normalizeLinkPath(href);
    const baseParts = baseDir ? baseDir.split("/") : [];
    const segments = cleaned.split("/");
    const resolved: string[] = [...baseParts];

    for (const segment of segments) {
      if (!segment || segment === ".") continue;
      if (segment === "..") {
        resolved.pop();
        continue;
      }
      resolved.push(segment);
    }

    return resolved.join("/");
  }

  function getBaseDirForLinks() {
    if (selectedFile?.path) {
      const parts = selectedFile.path.split("/").slice(2, -1);
      return parts.join("/");
    }
    return currentPath;
  }

  async function loadFileContentByPath(relativePath: string, fileName: string) {
    try {
      setContentLoading(true);
      const response = await fetch(`/api/skills/${skillSlug}/file/${relativePath}`);
      if (!response.ok) {
        throw new Error("Failed to load file content");
      }
      const content = await response.text();
      setSelectedFile({
        type: "file",
        name: fileName,
        path: `skills/${skillSlug}/${relativePath}`
      });
      setFileContent(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load file content");
      setFileContent("");
    } finally {
      setContentLoading(false);
    }
  }

  async function openRelativeLink(href: string, baseOverride?: string) {
    const baseDir = typeof baseOverride === "string" ? baseOverride : getBaseDirForLinks();
    const resolvedPath = resolveRelativePath(baseDir, href);
    if (!resolvedPath) return;

    if (resolvedPath.endsWith("/")) {
      await loadFilesAtPath(resolvedPath.replace(/\/+$/, ""));
      return;
    }

    const parts = resolvedPath.split("/");
    const fileName = parts.pop() || "";
    const dirPath = parts.join("/");

    const nextFiles = await loadFilesAtPath(dirPath);
    const match = nextFiles.find((entry) => entry.name === fileName && entry.type === "file");
    if (match) {
      await loadFileContent(match);
      return;
    }

    if (fileName) {
      await loadFileContentByPath(resolvedPath, fileName);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-24 rounded bg-border"></div>
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-border"></div>
            <div className="h-3 w-4/5 rounded bg-border"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && files.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="text-center text-sm text-text-muted">No additional files found in this skill</p>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="text-center text-sm text-text-muted">No files to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border/50 bg-surface px-3 py-2">
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.path || "root"} className="flex items-center gap-1">
            <button
              onClick={() => loadFilesAtPath(crumb.path)}
              className="text-xs font-mono text-primary hover:underline"
            >
              {crumb.name}
            </button>
            {index < breadcrumbs.length - 1 && <span className="text-text-muted">/</span>}
          </div>
        ))}
      </div>

      {/* File list */}
      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {files.map((file) => (
            <button
              key={file.path}
              onClick={() => loadFileContent(file)}
              className={`group flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-mono transition-all ${
                selectedFile?.path === file.path
                  ? "bg-primary/15 text-primary shadow-sm ring-1 ring-primary/20"
                  : "text-text-muted hover:bg-bg/60 hover:text-text-primary"
              }`}
              title={file.name}
            >
              <span className="shrink-0 text-base">{getFileIcon(file.name, file.type)}</span>
              <span className="min-w-0 flex-1 truncate">{file.name}</span>
              {file.type === "file" && file.size && (
                <span className="shrink-0 text-[10px] text-text-muted group-hover:text-text-primary">
                  {formatFileSize(file.size)}
                </span>
              )}
              {file.type === "dir" && (
                <span className="text-[10px] text-text-muted group-hover:text-text-primary">→</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* File viewer */}
      <div className="rounded-xl border border-border bg-surface p-4">
        {selectedFile ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getFileIcon(selectedFile.name, selectedFile.type)}</span>
                <div>
                  <h3 className="break-all font-mono text-sm font-semibold text-text-primary">
                    {selectedFile.name}
                  </h3>
                  <p className="mt-0.5 text-[11px] text-text-muted">
                    {selectedFile.type === "file" ? "File" : "Folder"}
                    {selectedFile.type === "file" && selectedFile.size ? ` · ${formatFileSize(selectedFile.size)}` : ""}
                  </p>
                </div>
              </div>
              {selectedFile.type === "file" && fileContent && (
                <div className="flex items-center gap-2">
                  <CopyButton value={fileContent} />
                </div>
              )}
            </div>

            {contentLoading ? (
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-border/50"></div>
                <div className="h-4 w-5/6 rounded bg-border/50"></div>
              </div>
            ) : fileContent ? (
              <div className="min-w-0">
                  {selectedFile.name.endsWith(".md") ? (
                    <div className="prose prose-sm max-w-none">
                      <MarkdownPreview markdown={fileContent} onRelativeLinkClick={openRelativeLink} />
                    </div>
                  ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-border/50 pb-2">
                      <span className="text-[11px] uppercase tracking-widest text-text-muted">Content Preview</span>
                      <span className="text-[11px] text-text-muted/60">
                        {fileContent.split("\n").length} lines
                      </span>
                    </div>
                    <pre className="max-h-[60vh] overflow-auto rounded-lg border border-border bg-bg/50 p-4 text-xs leading-relaxed text-text-primary">
                      {fileContent}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border/50 py-8 text-center">
                <p className="text-sm text-text-muted">No content to display</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-text-muted">Select a file or folder to view its content</p>
          </div>
        )}
      </div>
    </div>
  );
}
