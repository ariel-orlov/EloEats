interface Props {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-lg px-4 py-1.5 font-extrabold',
};

export default function ScoreBadge({ score, size = 'md' }: Props) {
  const positive = score >= 0;
  return (
    <span
      className={`inline-flex items-center rounded-pill font-bold tabular-nums ${sizes[size]} ${
        positive
          ? 'bg-primary-light text-primary'
          : 'bg-red-50 text-negative'
      }`}
    >
      {positive ? '+' : ''}{score}
    </span>
  );
}
