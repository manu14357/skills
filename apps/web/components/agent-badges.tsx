type AgentBadgesProps = {
  agents?: string[];
  compact?: boolean;
};

export function AgentBadges({ agents = [], compact = false }: AgentBadgesProps) {
  if (!agents.length) {
    return <span className="rounded-full border border-primary/35 bg-primary/10 px-2 py-0.5 text-xs text-primary">agent-agnostic</span>;
  }

  const shown = compact ? agents.slice(0, 3) : agents;

  return (
    <div className="flex flex-wrap gap-1.5">
      {shown.map((agent) => {
        return (
          <span key={agent} className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[11px] text-primary">
            {agent}
          </span>
        );
      })}
      {compact && agents.length > shown.length ? (
        <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-text-muted">+{agents.length - shown.length}</span>
      ) : null}
    </div>
  );
}
