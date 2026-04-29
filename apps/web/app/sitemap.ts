import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { listSkillFolderNames } from "@/lib/github";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: `${SITE_URL}/docs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7
    },
    {
      url: `${SITE_URL}/leaderboard`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6
    }
  ];

  const skills = await listSkillFolderNames();
  const skillRoutes: MetadataRoute.Sitemap = skills.map((slug) => ({
    url: `${SITE_URL}/s/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7
  }));

  return [...staticRoutes, ...skillRoutes];
}
