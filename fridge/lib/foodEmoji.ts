// Per-item emoji lookup. Falls back to category emoji in FoodCard when null.
const EMOJI: Record<string, string> = {
  // fruits
  apple: '🍎', banana: '🍌', orange: '🍊', lemon: '🍋', lime: '🍋',
  grape: '🍇', watermelon: '🍉', strawberry: '🍓', blueberry: '🫐',
  raspberry: '🫐', blackberry: '🫐', cherry: '🍒', peach: '🍑',
  pear: '🍐', mango: '🥭', pineapple: '🍍', kiwi: '🥝', avocado: '🥑',
  cantaloupe: '🍈', tangerine: '🍊', clementine: '🍊', 'mandarin orange': '🍊',
  pomegranate: '🍎', papaya: '🥭', plum: '🍑', apricot: '🍑', nectarine: '🍑',
  // veg
  broccoli: '🥦', cauliflower: '🥦', carrot: '🥕', corn: '🌽', cucumber: '🥒',
  'bell pepper': '🫑', tomato: '🍅', eggplant: '🍆', mushroom: '🍄',
  garlic: '🧄', onion: '🧅', 'red onion': '🧅', shallot: '🧅', leek: '🧅',
  potato: '🥔', 'sweet potato': '🍠', yam: '🍠',
  spinach: '🥬', kale: '🥬', lettuce: '🥬', cabbage: '🥬', arugula: '🥬',
  asparagus: '🌿', celery: '🌿', zucchini: '🥒',
  // protein
  egg: '🥚', 'chicken breast': '🍗', 'turkey breast': '🦃', salmon: '🐟',
  cod: '🐟', tuna: '🐟', sardine: '🐟', tilapia: '🐟', shrimp: '🦐',
  crab: '🦀', lobster: '🦞', tofu: '🍢', tempeh: '🍢',
  'ground beef': '🥩', 'pork chop': '🥩', 'ribeye steak': '🥩',
  bacon: '🥓', sausage: '🌭', 'hot dog': '🌭', salami: '🥓', pepperoni: '🥓',
  // dairy
  milk: '🥛', 'whole milk': '🥛', 'skim milk': '🥛', 'chocolate milk': '🥛',
  'greek yogurt': '🍦', 'cottage cheese': '🧀', 'cheddar cheese': '🧀',
  'mozzarella cheese': '🧀', 'feta cheese': '🧀', 'parmesan cheese': '🧀',
  'cream cheese': '🧀', 'string cheese': '🧀', butter: '🧈',
  // grains
  'white bread': '🍞', 'whole wheat bread': '🍞', bagel: '🥯', pita: '🥖',
  tortilla: '🌮', 'white rice': '🍚', 'brown rice': '🍚', quinoa: '🌾',
  oat: '🌾', oatmeal: '🥣', granola: '🥣', cereal: '🥣', pasta: '🍝',
  // legumes/nuts
  lentil: '🫘', 'black bean': '🫘', chickpea: '🫘', hummus: '🫛',
  edamame: '🫛', almond: '🥜', walnut: '🥜', cashew: '🥜', peanut: '🥜',
  pistachio: '🥜', 'peanut butter': '🥜',
  // junk / fast food
  'coca cola': '🥤', coke: '🥤', pepsi: '🥤', 'mountain dew': '🥤',
  'diet coke': '🥤', soda: '🥤', 'red bull': '🪫', 'monster energy': '🪫',
  gatorade: '🧃', powerade: '🧃', 'juice box': '🧃', 'orange juice': '🧃',
  'apple juice': '🧃', 'fruit punch': '🧃', lemonade: '🧃',
  beer: '🍺', wine: '🍷', cocktail: '🍸', liquor: '🥃',
  'ice cream': '🍨', cheesecake: '🍰', cake: '🍰', cupcake: '🧁',
  brownie: '🍫', 'chocolate bar': '🍫', candy: '🍬', donut: '🍩',
  'big mac': '🍔', 'mcdonalds burger': '🍔', 'french fries': '🍟',
  'fried chicken': '🍗', 'chicken nuggets': '🍗', pizza: '🍕',
  popcorn: '🍿', 'microwave popcorn': '🍿', pretzel: '🥨',
  'potato chip': '🥔', 'tortilla chip': '🌽', doritos: '🌽', cheetos: '🧀',
  oreo: '🍪', cookie: '🍪',
  // beverages
  water: '💧', 'sparkling water': '💧', 'green tea': '🍵',
  coffee: '☕', 'black coffee': '☕', smoothie: '🥤', milkshake: '🥤',
  // condiments
  ketchup: '🥫', mustard: '🥫', mayo: '🥫', sriracha: '🌶️', 'hot sauce': '🌶️',
  salsa: '🌶️', guacamole: '🥑', honey: '🍯', 'maple syrup': '🍁',
  jam: '🍓', nutella: '🍫', 'olive oil': '🫒', 'green olive': '🫒',
  kimchi: '🌶️', sauerkraut: '🥬',
};

function normalize(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, ' ').replace(/s$/, '');
}

export function foodEmoji(name: string): string | null {
  const n = normalize(name);
  if (EMOJI[n]) return EMOJI[n];
  const raw = name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, ' ');
  if (EMOJI[raw]) return EMOJI[raw];
  for (const key of Object.keys(EMOJI)) {
    if (key.length < 4) continue;
    const re = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
    if (re.test(raw)) return EMOJI[key];
  }
  return null;
}
