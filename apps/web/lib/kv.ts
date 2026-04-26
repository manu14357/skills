const copyClicks = new Map<string, number>();

export async function incrementSkillCopyCount(skillName: string): Promise<number> {
  const current = copyClicks.get(skillName) ?? 0;
  const next = current + 1;
  copyClicks.set(skillName, next);
  return next;
}

export async function getSkillCopyCounts(): Promise<Array<{ skill: string; count: number }>> {
  return [...copyClicks.entries()]
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count);
}
