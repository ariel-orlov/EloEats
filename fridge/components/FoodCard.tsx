import ScoreBadge from './ScoreBadge';
import type { FoodItem } from '@/types';
import { foodEmoji } from '@/lib/foodEmoji';

const CATEGORY_META: Record<FoodItem['category'], { label: string; emoji: string; color: string; bg: string }> = {
  vegetable_fruit:    { label: 'Veg & Fruit', emoji: '🥦', color: '#166534', bg: '#DCFCE7' },
  whole_grain_legume: { label: 'Grains',       emoji: '🌾', color: '#92400E', bg: '#FEF3C7' },
  lean_protein:       { label: 'Protein',      emoji: '🥩', color: '#9F1239', bg: '#FFE4E6' },
  dairy:              { label: 'Dairy',        emoji: '🥛', color: '#1E40AF', bg: '#DBEAFE' },
  processed:          { label: 'Processed',    emoji: '📦', color: '#9A3412', bg: '#FFEDD5' },
  fast_food_sugary:   { label: 'Junk',         emoji: '🍔', color: '#991B1B', bg: '#FEE2E2' },
};

interface Props {
  item: FoodItem;
  consumed?: boolean;
  showExplanation?: boolean;
}

export default function FoodCard({ item, consumed = false, showExplanation = false }: Props) {
  const meta = CATEGORY_META[item.category];
  const emoji = foodEmoji(item.name) ?? meta.emoji;

  return (
    <div className={`flex items-center gap-3 py-3.5 px-4 transition-opacity ${consumed ? 'opacity-40' : ''}`}>
      {/* Emoji category chip */}
      <span
        className="shrink-0 w-9 h-9 rounded-[10px] flex items-center justify-center text-lg leading-none select-none"
        style={{ background: meta.bg }}
        aria-hidden="true"
      >
        {emoji}
      </span>

      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-[15px] leading-snug ${consumed ? 'line-through text-text-muted' : 'text-text'}`}>
          {item.name}
        </p>
        <span
          className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full"
          style={{ color: meta.color, background: meta.bg }}
        >
          {meta.label}
        </span>
        {showExplanation && (
          <p className="text-xs text-text-muted mt-1 leading-relaxed">{item.explanation}</p>
        )}
      </div>

      <ScoreBadge score={item.score} size="md" />
    </div>
  );
}
