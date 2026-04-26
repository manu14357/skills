import { Octokit } from "@octokit/rest";
import { DEFAULT_REVALIDATE_SECONDS, RAW_BASE_URL, REPO_NAME, REPO_OWNER, REPO_SLUG, SKILLS_DIR } from "./constants";
import { createSkillMarkdown, normalizeSkillName, parseSkillMarkdown, SkillRecord } from "./skill";

function readToken(): string | undefined {
  return process.env.GITHUB_READ_TOKEN || process.env.GITHUB_WRITE_TOKEN;
}

function writeToken(): string {
  const token = process.env.GITHUB_WRITE_TOKEN;
  if (!token) {
    throw new Error("GITHUB_WRITE_TOKEN is not configured");
  }
  return token;
}

function createClient(token: string | undefined): Octokit {
  return new Octokit({ auth: token });
}

function decodeContent(base64Content: string): string {
  return Buffer.from(base64Content, "base64").toString("utf8");
}

/** Build GitHub API headers, optionally with auth token. */
function ghHeaders(token?: string): Record<string, string> {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
  };
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
}

type GitHubContentFile = {
  type: "file";
  name: string;
  path: string;
  sha: string;
  content?: string;
  download_url: string | null;
};

type GitHubContentDir = {
  type: "dir";
  name: string;
  path: string;
  sha: string;
};

type SkillCommit = {
  sha: string;
  message: string;
  author: string;
  authoredAt: string;
  htmlUrl: string;
};

/** Run async tasks in chunks to avoid GitHub rate limiting (429). */
async function batchedAll<T>(items: Array<() => Promise<T>>, batchSize = 10): Promise<T[]> {
  const results: T[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map((fn) => fn()));
    results.push(...batchResults);
  }
  return results;
}

export async function listSkillFolderNames(): Promise<string[]> {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${SKILLS_DIR}`;
  const token = readToken();
  try {
    const res = await fetch(url, {
      headers: ghHeaders(token),
      next: { revalidate: DEFAULT_REVALIDATE_SECONDS }
    });
    if (!res.ok) return [];
    const data = (await res.json()) as Array<{ type: string; name: string }>;
    return data
      .filter((entry) => entry.type === "dir")
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b));
  } catch {
    return [];
  }
}

async function readSkillFileRaw(skillName: string, ref?: string): Promise<{ raw: string; sha: string; downloadUrl: string | null }> {
  const token = readToken();

  // Prefer raw.githubusercontent.com for public repos (no auth needed, no rate limits)
  if (!ref) {
    try {
      const rawUrl = `${RAW_BASE_URL}/${SKILLS_DIR}/${skillName}/SKILL.md`;
      const res = await fetch(rawUrl, {
        next: { revalidate: DEFAULT_REVALIDATE_SECONDS }
      });
      if (res.ok) {
        const raw = await res.text();
        // We still need the sha — fetch it separately via API
        const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${SKILLS_DIR}/${skillName}/SKILL.md`;
        const apiRes = await fetch(apiUrl, {
          headers: ghHeaders(token),
          next: { revalidate: DEFAULT_REVALIDATE_SECONDS }
        });
        let sha = "";
        let downloadUrl: string | null = null;
        if (apiRes.ok) {
          const apiData = (await apiRes.json()) as { sha: string; download_url: string | null };
          sha = apiData.sha;
          downloadUrl = apiData.download_url;
        }
        return { raw, sha, downloadUrl };
      }
    } catch {
      // fall through to API path
    }
  }

  // Fallback: GitHub Contents API (needed when ref is provided, or raw CDN failed)
  const qs = ref ? `?ref=${encodeURIComponent(ref)}` : "";
  const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${SKILLS_DIR}/${skillName}/SKILL.md${qs}`;
  const apiRes = await fetch(apiUrl, {
    headers: ghHeaders(token),
    next: { revalidate: DEFAULT_REVALIDATE_SECONDS }
  });

  if (!apiRes.ok) {
    throw new Error(`Failed to fetch SKILL.md for ${skillName}: ${apiRes.status}`);
  }

  const file = (await apiRes.json()) as GitHubContentFile;
  if (!file.content) {
    throw new Error(`Missing file content for ${skillName}`);
  }

  return {
    raw: decodeContent(file.content),
    sha: file.sha,
    downloadUrl: file.download_url
  };
}

export async function getSkillRaw(skillName: string, ref?: string): Promise<string> {
  const normalized = normalizeSkillName(skillName);
  const fileData = await readSkillFileRaw(normalized, ref);
  return fileData.raw;
}

async function readLastCommitDate(skillName: string): Promise<string | undefined> {
  const token = readToken();
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?path=${SKILLS_DIR}/${skillName}/SKILL.md&per_page=1`;
  try {
    const res = await fetch(url, {
      headers: ghHeaders(token),
      next: { revalidate: DEFAULT_REVALIDATE_SECONDS }
    });
    if (!res.ok) return undefined;
    const data = (await res.json()) as Array<{ commit: { author: { date: string } } }>;
    return data[0]?.commit?.author?.date;
  } catch {
    return undefined;
  }
}

export async function getSkillByName(skillName: string, ref?: string): Promise<SkillRecord> {
  const normalized = normalizeSkillName(skillName);
  const [fileData, lastEditedAt] = await Promise.all([
    readSkillFileRaw(normalized, ref),
    ref ? Promise.resolve(undefined) : readLastCommitDate(normalized)
  ]);

  const parsed = parseSkillMarkdown(fileData.raw, normalized);

  return {
    ...parsed,
    slug: normalized,
    path: `${SKILLS_DIR}/${normalized}/SKILL.md`,
    sha: fileData.sha,
    lastEditedAt
  };
}

export async function listAllSkills(): Promise<SkillRecord[]> {
  const names = await listSkillFolderNames();

  // Batch 8 at a time to avoid GitHub rate limiting (429)
  const tasks = names.map((name) => async () => {
    try {
      return await getSkillByName(name);
    } catch {
      return null;
    }
  });

  const results = await batchedAll(tasks, 8);
  return results.filter((skill): skill is SkillRecord => Boolean(skill));
}

export async function getSkillHistory(skillName: string): Promise<SkillCommit[]> {
  const normalized = normalizeSkillName(skillName);
  const token = readToken();
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?path=${SKILLS_DIR}/${normalized}/SKILL.md&per_page=100`;
  try {
    const res = await fetch(url, {
      headers: ghHeaders(token),
      next: { revalidate: DEFAULT_REVALIDATE_SECONDS }
    });
    if (!res.ok) return [];
    const data = (await res.json()) as Array<{
      sha: string;
      html_url: string;
      author: { login: string } | null;
      commit: { message: string; author: { name: string; date: string } | null };
    }>;
    return data.map((commit) => ({
      sha: commit.sha,
      message: commit.commit.message,
      author: commit.author?.login || commit.commit.author?.name || "unknown",
      authoredAt: commit.commit.author?.date || "",
      htmlUrl: commit.html_url
    }));
  } catch {
    return [];
  }
}

export async function getSkillAtCommit(skillName: string, commitSha: string): Promise<SkillRecord> {
  return getSkillByName(skillName, commitSha);
}

export async function getSkillRelatedDiscussion(skillName: string): Promise<Array<{ title: string; url: string; number: number }>> {
  const normalized = normalizeSkillName(skillName);
  const token = readToken();
  // Use REST search endpoint directly (the Octokit method is deprecated and returns 422)
  const q = encodeURIComponent(`repo:${REPO_SLUG} ${normalized} in:title,body`);
  try {
    const res = await fetch(`https://api.github.com/search/issues?q=${q}&per_page=10`, {
      headers: ghHeaders(token),
      next: { revalidate: DEFAULT_REVALIDATE_SECONDS }
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { items: Array<{ title: string; html_url: string; number: number }> };
    return data.items.map((item) => ({
      title: item.title,
      url: item.html_url,
      number: item.number
    }));
  } catch {
    return [];
  }
}

export async function createOrUpdateSkillPullRequest(input: {
  mode: "submit" | "edit";
  skillName: string;
  description: string;
  category?: string;
  agents?: string[];
  author?: string;
  body: string;
  summary: string;
  forkedFrom?: string;
}): Promise<{ pullRequestUrl: string; pullRequestNumber: number; branch: string }> {
  const normalized = normalizeSkillName(input.skillName);
  const branchPrefix = input.mode === "submit" ? "submit" : "edit";
  const branch = `${branchPrefix}/${normalized}-${Date.now()}`;
  const writeClient = createClient(writeToken());

  const baseRef = await writeClient.git.getRef({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    ref: "heads/main",
    headers: {
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });

  await writeClient.git.createRef({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    ref: `refs/heads/${branch}`,
    sha: baseRef.data.object.sha,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });

  const markdown = createSkillMarkdown(
    {
      name: normalized,
      description: input.description,
      category: input.category,
      agents: input.agents,
      author: input.author
    },
    input.body
  );

  const path = `${SKILLS_DIR}/${normalized}/SKILL.md`;

  let existingSha: string | undefined;
  if (input.mode === "edit") {
    try {
      const existing = await writeClient.repos.getContent({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28"
        }
      });
      if (!Array.isArray(existing.data) && existing.data.type === "file") {
        existingSha = existing.data.sha;
      }
    } catch {
      existingSha = undefined;
    }
  }

  await writeClient.repos.createOrUpdateFileContents({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    path,
    branch,
    message: input.mode === "submit" ? `Add skill: ${normalized}` : `Edit skill: ${normalized} - ${input.summary}`,
    content: Buffer.from(markdown).toString("base64"),
    sha: existingSha,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });

  const bodyParts: string[] = [];
  if (input.forkedFrom) {
    bodyParts.push(`Forked from: ${input.forkedFrom}`);
  }
  bodyParts.push(input.summary);

  const pr = await writeClient.pulls.create({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    base: "main",
    head: branch,
    title: input.mode === "submit" ? `Add skill: ${normalized}` : `Edit skill: ${normalized} - ${input.summary}`,
    body: bodyParts.join("\n\n"),
    headers: {
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });

  return {
    pullRequestUrl: pr.data.html_url,
    pullRequestNumber: pr.data.number,
    branch
  };
}

export async function revertSkillToCommit(input: {
  skillName: string;
  targetCommitSha: string;
  summary: string;
}): Promise<{ pullRequestUrl: string; pullRequestNumber: number }> {
  const skillAtCommit = await getSkillAtCommit(input.skillName, input.targetCommitSha);

  const pr = await createOrUpdateSkillPullRequest({
    mode: "edit",
    skillName: skillAtCommit.slug,
    description: skillAtCommit.description,
    category: skillAtCommit.category,
    agents: skillAtCommit.agents,
    author: skillAtCommit.author,
    body: skillAtCommit.body,
    summary: input.summary
  });

  return {
    pullRequestNumber: pr.pullRequestNumber,
    pullRequestUrl: pr.pullRequestUrl
  };
}

export async function getLeaderboardData() {
  const client = createClient(readToken());

  const [contributors, pulls, commits] = await Promise.all([
    client.repos.listContributors({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      per_page: 20,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28"
      }
    }),
    client.pulls.list({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      state: "closed",
      per_page: 50,
      sort: "updated",
      direction: "desc",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28"
      }
    }),
    client.repos.listCommits({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      per_page: 50,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28"
      }
    })
  ]);

  const mergedPulls = pulls.data.filter((pr) => Boolean(pr.merged_at));

  return {
    contributors: contributors.data.map((entry) => ({
      login: entry.login || "unknown",
      contributions: entry.contributions || 0,
      url: entry.html_url
    })),
    mergedPulls: mergedPulls.map((pr) => ({
      number: pr.number,
      title: pr.title,
      mergedAt: pr.merged_at || "",
      url: pr.html_url
    })),
    recentCommits: commits.data.map((commit) => ({
      sha: commit.sha,
      message: commit.commit.message,
      authoredAt: commit.commit.author?.date || "",
      author: commit.author?.login || commit.commit.author?.name || "unknown",
      url: commit.html_url
    }))
  };
}

export function withRevalidate<T>(value: T): T {
  void DEFAULT_REVALIDATE_SECONDS;
  return value;
}
