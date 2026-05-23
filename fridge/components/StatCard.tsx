interface Props {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}

export default function StatCard({ label, value, sub, accent = false }: Props) {
  return (
    <div className={`rounded-card p-4 flex flex-col gap-1 ${accent ? 'bg-primary text-white' : 'bg-surface border border-border shadow-card'}`}>
      <span className={`text-xs font-medium uppercase tracking-wide ${accent ? 'text-primary-light' : 'text-text-muted'}`}>{label}</span>
      <span className={`text-2xl font-extrabold tabular-nums ${accent ? 'text-white' : 'text-text'}`}>{value}</span>
      {sub && <span className={`text-xs ${accent ? 'text-primary-light' : 'text-text-muted'}`}>{sub}</span>}
    </div>
  );
}
