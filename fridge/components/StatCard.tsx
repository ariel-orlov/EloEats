interface Props {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}

export default function StatCard({ label, value, sub, accent = false }: Props) {
  if (accent) {
    return (
      <div
        className="rounded-card p-4 flex flex-col gap-1.5"
        style={{ background: 'linear-gradient(135deg, #1B6B45 0%, #2E9060 100%)' }}
      >
        <span className="text-primary-light text-xs font-semibold uppercase tracking-wider opacity-80">{label}</span>
        <span
          className="font-extrabold leading-none text-white"
          style={{
            fontFamily: '"Bricolage Grotesque", ui-sans-serif, sans-serif',
            fontSize: '28px',
            letterSpacing: '-0.03em',
          }}
        >
          {value}
        </span>
        {sub && <span className="text-primary-light text-xs opacity-70">{sub}</span>}
      </div>
    );
  }

  return (
    <div className="rounded-card bg-surface border border-border p-4 flex flex-col gap-1.5 shadow-card">
      <span className="text-text-faint text-xs font-semibold uppercase tracking-wider">{label}</span>
      <span
        className="font-extrabold leading-none text-text"
        style={{
          fontFamily: '"Bricolage Grotesque", ui-sans-serif, sans-serif',
          fontSize: '28px',
          letterSpacing: '-0.03em',
        }}
      >
        {value}
      </span>
      {sub && <span className="text-text-muted text-xs">{sub}</span>}
    </div>
  );
}
