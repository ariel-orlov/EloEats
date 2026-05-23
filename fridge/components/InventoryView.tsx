'use client';

import type { FoodItem } from '@/types';

interface Props {
  items: FoodItem[];
  title?: string;
  highlight?: FoodItem[]; // items to flag as consumed
}

const CATEGORY_LABELS: Record<FoodItem['category'], string> = {
  vegetable_fruit: 'Veg & Fruit',
  whole_grain_legume: 'Grains & Legumes',
  lean_protein: 'Protein',
  dairy: 'Dairy',
  processed: 'Processed',
  fast_food_sugary: 'Junk',
};

export default function InventoryView({ items, title = 'Fridge contents', highlight = [] }: Props) {
  const highlightNames = new Set(highlight.map(i => i.name));

  if (items.length === 0) {
    return (
      <div style={{ padding: 24, color: 'var(--muted)', textAlign: 'center' }}>
        No inventory yet. Run a scan to identify fridge contents.
      </div>
    );
  }

  return (
    <div>
      <p style={{ fontWeight: 600, marginBottom: 12, fontSize: 14, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {title} — {items.length} items
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {items.map((item, i) => {
          const consumed = highlightNames.has(item.name);
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                background: consumed ? '#fff5f5' : '#fff',
                borderRadius: 8,
                opacity: consumed ? 0.7 : 1,
                gap: 12,
              }}
            >
              <div style={{ flex: 1 }}>
                <span style={{
                  fontWeight: 500,
                  textDecoration: consumed ? 'line-through' : 'none',
                  color: consumed ? 'var(--muted)' : 'var(--text)',
                }}>
                  {item.name}
                </span>
                <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--muted)' }}>
                  {CATEGORY_LABELS[item.category]}
                </span>
              </div>
              <span style={{
                fontWeight: 700,
                fontSize: 16,
                color: item.score >= 0 ? 'var(--green)' : 'var(--red)',
                minWidth: 36,
                textAlign: 'right',
              }}>
                {item.score > 0 ? '+' : ''}{item.score}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
