interface Props {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}

export default function StatCard({ label, value, sub, accent = false }: Props) {
  if (accent) {
    return (
      <div className="rounded-card bg-primary p-5 flex flex-col gap-1.5">
        <span className="text-primary-light text-xs font-medium">{label}</span>
        <span className="text-white text-3xl font-extrabold tracking-tight tabular-nums">{value}</span>
        {sub && <span className="text-primary-light text-xs">{sub}</span>}
      </div>
    );
  }

  return (
    <div className="rounded-card bg-surface border border-border p-5 flex flex-col gap-1.5">
      <span className="text-text-faint text-xs font-medium">{label}</span>
      <span className="text-text text-3xl font-extrabold tracking-tight tabular-nums">{value}</span>
      {sub && <span className="text-text-muted text-xs">{sub}</span>}
    </div>
  );
}
