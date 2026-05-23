import ScoreBadge from './ScoreBadge';
import type { FoodItem } from '@/types';

const CATEGORY_META: Record<FoodItem['category'], { label: string; dot: string }> = {
  vegetable_fruit:    { label: 'Veg & Fruit',  dot: '#22c55e' },
  whole_grain_legume: { label: 'Grains',        dot: '#f59e0b' },
  lean_protein:       { label: 'Protein',       dot: '#3b82f6' },
  dairy:              { label: 'Dairy',         dot: '#0ea5e9' },
  processed:          { label: 'Processed',     dot: '#f97316' },
  fast_food_sugary:   { label: 'Junk',          dot: '#ef4444' },
};

interface Props {
  item: FoodItem;
  consumed?: boolean;
  showExplanation?: boolean;
}

export default function FoodCard({ item, consumed = false, showExplanation = false }: Props) {
  const meta = CATEGORY_META[item.category];

  return (
    <div className={`flex items-center gap-3 py-3.5 px-4 transition-opacity ${consumed ? 'opacity-40' : ''}`}>
      {/* Category dot */}
      <span
        className="shrink-0 w-2 h-2 rounded-full mt-0.5"
        style={{ background: meta.dot }}
      />

      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-[15px] leading-snug ${consumed ? 'line-through text-text-muted' : 'text-text'}`}>
          {item.name}
        </p>
        <p className="text-xs text-text-faint mt-0.5">{meta.label}</p>
        {showExplanation && (
          <p className="text-xs text-text-muted mt-1 leading-relaxed">{item.explanation}</p>
        )}
      </div>

      <ScoreBadge score={item.score} size="md" />
    </div>
  );
}
