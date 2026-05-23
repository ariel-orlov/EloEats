interface Props {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function ScoreBadge({ score, size = 'md' }: Props) {
  const pos = score >= 0;
  const label = `${pos ? '+' : ''}${score}`;

  if (size === 'lg') {
    return (
      <span className={`inline-flex items-center gap-1 tabular-nums font-extrabold tracking-tight text-3xl ${pos ? 'text-primary' : 'text-negative'}`}>
        {label}
      </span>
    );
  }

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center tabular-nums font-semibold text-xs ${pos ? 'text-primary' : 'text-negative'}`}>
        {label}
      </span>
    );
  }

  // md — used in lists: subtle background, no pill shape, just a tight rounded rect
  return (
    <span className={`inline-flex items-center tabular-nums font-bold text-sm rounded-[6px] px-2 py-0.5 ${
      pos
        ? 'bg-primary-light text-primary'
        : 'bg-red-50 text-negative'
    }`}>
      {label}
    </span>
  );
}
