import ScoreBadge from './ScoreBadge';
import type { FoodItem } from '@/types';

const CATEGORY_LABELS: Record<FoodItem['category'], string> = {
  vegetable_fruit: 'Veg & Fruit',
  whole_grain_legume: 'Grains',
  lean_protein: 'Protein',
  dairy: 'Dairy',
  processed: 'Processed',
  fast_food_sugary: 'Junk',
};

const CATEGORY_COLORS: Record<FoodItem['category'], string> = {
  vegetable_fruit: 'bg-emerald-50 text-emerald-700',
  whole_grain_legume: 'bg-amber-50 text-amber-700',
  lean_protein: 'bg-blue-50 text-blue-700',
  dairy: 'bg-sky-50 text-sky-700',
  processed: 'bg-orange-50 text-orange-700',
  fast_food_sugary: 'bg-red-50 text-red-600',
};

interface Props {
  item: FoodItem;
  consumed?: boolean;
  showExplanation?: boolean;
}

export default function FoodCard({ item, consumed = false, showExplanation = false }: Props) {
  return (
    <div
      className={`bg-surface rounded-card border border-border shadow-card p-4 flex items-start gap-3 transition-opacity ${
        consumed ? 'opacity-40' : ''
      }`}
    >
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-text truncate ${consumed ? 'line-through text-text-muted' : ''}`}>
          {item.name}
        </p>
        <span className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-pill ${CATEGORY_COLORS[item.category]}`}>
          {CATEGORY_LABELS[item.category]}
        </span>
        {showExplanation && (
          <p className="mt-1.5 text-xs text-text-muted leading-snug">{item.explanation}</p>
        )}
      </div>
      <ScoreBadge score={item.score} size="md" />
    </div>
  );
}
