interface Props {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function ScoreBadge({ score, size = 'md' }: Props) {
  const pos = score >= 0;
  const label = `${pos ? '+' : ''}${score}`;

  if (size === 'lg') {
    return (
      <span
        className="inline-flex items-center tabular-nums font-extrabold"
        style={{
          fontFamily: '"Bricolage Grotesque", ui-sans-serif, sans-serif',
          fontSize: '56px',
          letterSpacing: '-0.04em',
          lineHeight: 1,
          color: pos ? '#16A34A' : '#DC2626',
        }}
      >
        {label}
      </span>
    );
  }

  if (size === 'sm') {
    return (
      <span
        className="inline-flex items-center tabular-nums font-semibold text-xs"
        style={{
          fontFamily: '"Fira Code", ui-monospace, monospace',
          color: pos ? '#16A34A' : '#DC2626',
        }}
      >
        {label}
      </span>
    );
  }

  // md
  return (
    <span
      className="inline-flex items-center tabular-nums font-bold text-sm rounded-[8px] px-2 py-0.5"
      style={{
        fontFamily: '"Fira Code", ui-monospace, monospace',
        background: pos ? '#D8EEE5' : '#FEE2E2',
        color: pos ? '#166534' : '#DC2626',
      }}
    >
      {label}
    </span>
  );
}
