import Link from "next/link";
import { getLeaderboardData, listAllSkills } from "@/lib/github";
import { getSkillCopyCounts } from "@/lib/kv";

export const revalidate = 60;

export default async function LeaderboardPage() {
  const [leaderboard, copyCounts, skills] = await Promise.all([
    getLeaderboardData().catch(() => ({ contributors: [], mergedPulls: [], recentCommits: [] })),
    getSkillCopyCounts(),
    listAllSkills().catch(() => [])
  ]);

  const newestSkills = [...skills]
    .filter((s) => Boolean(s.lastEditedAt))
    .sort((a, b) => new Date(b.lastEditedAt || 0).getTime() - new Date(a.lastEditedAt || 0).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-14">
      <div className="border-b border-border pb-8">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">Community</p>
        <h1 className="text-3xl font-bold text-text-primary md:text-4xl">Leaderboard</h1>
      </div>

      <div className="grid gap-12 md:grid-cols-2">
        {/* Contributors */}
        <section>
          <h2 className="mb-4 text-xs uppercase tracking-widest text-text-muted">Top contributors</h2>
          <ul className="space-y-0">
            {leaderboard.contributors.slice(0, 10).map((entry, i) => (
              <li key={entry.login} className="flex items-center justify-between border-b border-border py-3">
                <div className="flex items-center gap-3">
                  <span className="w-5 text-xs text-text-muted">{i + 1}</span>
                  <a href={entry.url} target="_blank" rel="noreferrer" className="text-sm text-text-primary hover:text-primary">
                    @{entry.login}
                  </a>
                </div>
                <span className="text-sm text-text-muted">{entry.contributions}</span>
              </li>
            ))}
            {leaderboard.contributors.length === 0 && (
              <li className="py-4 text-sm text-text-muted">No data yet.</li>
            )}
          </ul>
        </section>

        {/* Most installed */}
        <section>
          <h2 className="mb-4 text-xs uppercase tracking-widest text-text-muted">Most installed</h2>
          <ul className="space-y-0">
            {copyCounts.slice(0, 10).map((entry, i) => (
              <li key={entry.skill} className="flex items-center justify-between border-b border-border py-3">
                <div className="flex items-center gap-3">
                  <span className="w-5 text-xs text-text-muted">{i + 1}</span>
                  <Link href={`/s/${entry.skill}`} className="font-mono text-sm text-text-primary hover:text-primary">
                    {entry.skill}
                  </Link>
                </div>
                <span className="text-sm text-text-muted">{entry.count}</span>
              </li>
            ))}
            {copyCounts.length === 0 && (
              <li className="py-4 text-sm text-text-muted">No install data yet.</li>
            )}
          </ul>
        </section>
      </div>

      {/* Recently edited */}
      <section>
        <h2 className="mb-4 text-xs uppercase tracking-widest text-text-muted">Recently edited</h2>
        <ul className="grid gap-0 sm:grid-cols-2">
          {newestSkills.map((skill) => (
            <li key={skill.slug} className="border-b border-border py-3">
              <Link href={`/s/${skill.slug}`} className="font-mono text-sm text-text-primary hover:text-primary">
                {skill.slug}
              </Link>
              <p className="mt-0.5 text-xs text-text-muted">
                {skill.lastEditedAt ? new Date(skill.lastEditedAt).toLocaleString() : ""}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

