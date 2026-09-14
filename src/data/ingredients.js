/**
 * INGREDIENTS — curated list of 100 common kitchen ingredients.
 * Organized into 5 categories for display grouping.
 * Each ingredient has a unique id, display name, emoji, and
 * category label.
 *
 * @typedef {Object} Ingredient
 * @property {string} id       - Unique slug
 * @property {string} name     - Display name
 * @property {string} emoji    - Visual identifier
 * @property {string} category - One of the 5 category keys
 */

/** @type {Ingredient[]} */
export const INGREDIENTS = [
  // VEGETABLES (20)
  { id: 'tomato',      name: 'Tomato',      emoji: '🍅', category: 'Vegetables' },
  { id: 'onion',       name: 'Onion',       emoji: '🧅', category: 'Vegetables' },
  { id: 'garlic',      name: 'Garlic',      emoji: '🧄', category: 'Vegetables' },
  { id: 'potato',      name: 'Potato',      emoji: '🥔', category: 'Vegetables' },
  { id: 'spinach',     name: 'Spinach',     emoji: '🥬', category: 'Vegetables' },
  { id: 'broccoli',    name: 'Broccoli',    emoji: '🥦', category: 'Vegetables' },
  { id: 'carrot',      name: 'Carrot',      emoji: '🥕', category: 'Vegetables' },
  { id: 'capsicum',    name: 'Capsicum',    emoji: '🫑', category: 'Vegetables' },
  { id: 'mushroom',    name: 'Mushroom',    emoji: '🍄', category: 'Vegetables' },
  { id: 'corn',        name: 'Corn',        emoji: '🌽', category: 'Vegetables' },
  { id: 'eggplant',    name: 'Eggplant',    emoji: '🍆', category: 'Vegetables' },
  { id: 'cucumber',    name: 'Cucumber',    emoji: '🥒', category: 'Vegetables' },
  { id: 'peas',        name: 'Peas',        emoji: '🫛', category: 'Vegetables' },
  { id: 'cauliflower', name: 'Cauliflower', emoji: '🥦', category: 'Vegetables' },
  { id: 'cabbage',     name: 'Cabbage',     emoji: '🥬', category: 'Vegetables' },
  { id: 'zucchini',    name: 'Zucchini',    emoji: '🥒', category: 'Vegetables' },
  { id: 'celery',      name: 'Celery',      emoji: '🌿', category: 'Vegetables' },
  { id: 'beetroot',    name: 'Beetroot',    emoji: '🫚', category: 'Vegetables' },
  { id: 'asparagus',   name: 'Asparagus',   emoji: '🌱', category: 'Vegetables' },
  { id: 'leek',        name: 'Leek',        emoji: '🧅', category: 'Vegetables' },

  // PROTEINS (20)
  { id: 'chicken',      name: 'Chicken',      emoji: '🍗', category: 'Proteins' },
  { id: 'eggs',         name: 'Eggs',         emoji: '🥚', category: 'Proteins' },
  { id: 'tofu',         name: 'Tofu',         emoji: '🫙', category: 'Proteins' },
  { id: 'salmon',       name: 'Salmon',       emoji: '🐟', category: 'Proteins' },
  { id: 'beef',         name: 'Beef',         emoji: '🥩', category: 'Proteins' },
  { id: 'shrimp',       name: 'Shrimp',       emoji: '🦐', category: 'Proteins' },
  { id: 'tuna',         name: 'Tuna',         emoji: '🐟', category: 'Proteins' },
  { id: 'lamb',         name: 'Lamb',         emoji: '🥩', category: 'Proteins' },
  { id: 'pork',         name: 'Pork',         emoji: '🥩', category: 'Proteins' },
  { id: 'chickpeas',    name: 'Chickpeas',    emoji: '🫘', category: 'Proteins' },
  { id: 'lentils',      name: 'Lentils',      emoji: '🫘', category: 'Proteins' },
  { id: 'kidney-beans', name: 'Kidney Beans', emoji: '🫘', category: 'Proteins' },
  { id: 'paneer',       name: 'Paneer',       emoji: '🧀', category: 'Proteins' },
  { id: 'sardines',     name: 'Sardines',     emoji: '🐟', category: 'Proteins' },
  { id: 'duck',         name: 'Duck',         emoji: '🦆', category: 'Proteins' },
  { id: 'crab',         name: 'Crab',         emoji: '🦀', category: 'Proteins' },
  { id: 'turkey',       name: 'Turkey',       emoji: '🦃', category: 'Proteins' },
  { id: 'black-beans',  name: 'Black Beans',  emoji: '🫘', category: 'Proteins' },
  { id: 'tempeh',       name: 'Tempeh',       emoji: '🫙', category: 'Proteins' },
  { id: 'cod',          name: 'Cod',          emoji: '🐟', category: 'Proteins' },

  // DAIRY (20)
  { id: 'milk',          name: 'Milk',          emoji: '🥛', category: 'Dairy' },
  { id: 'butter',        name: 'Butter',        emoji: '🧈', category: 'Dairy' },
  { id: 'cheese',        name: 'Cheese',        emoji: '🧀', category: 'Dairy' },
  { id: 'yogurt',        name: 'Yogurt',        emoji: '🥛', category: 'Dairy' },
  { id: 'cream',         name: 'Heavy Cream',   emoji: '🥛', category: 'Dairy' },
  { id: 'mozzarella',    name: 'Mozzarella',    emoji: '🧀', category: 'Dairy' },
  { id: 'parmesan',      name: 'Parmesan',      emoji: '🧀', category: 'Dairy' },
  { id: 'feta',          name: 'Feta',          emoji: '🧀', category: 'Dairy' },
  { id: 'cream-cheese',  name: 'Cream Cheese',  emoji: '🧀', category: 'Dairy' },
  { id: 'sour-cream',    name: 'Sour Cream',    emoji: '🥛', category: 'Dairy' },
  { id: 'ghee',          name: 'Ghee',          emoji: '🧈', category: 'Dairy' },
  { id: 'ricotta',       name: 'Ricotta',       emoji: '🧀', category: 'Dairy' },
  { id: 'condensed-milk',name: 'Condensed Milk',emoji: '🥛', category: 'Dairy' },
  { id: 'buttermilk',    name: 'Buttermilk',    emoji: '🥛', category: 'Dairy' },
  { id: 'whipped-cream', name: 'Whipped Cream', emoji: '🍦', category: 'Dairy' },
  { id: 'gouda',         name: 'Gouda',         emoji: '🧀', category: 'Dairy' },
  { id: 'brie',          name: 'Brie',          emoji: '🧀', category: 'Dairy' },
  { id: 'cheddar',       name: 'Cheddar',       emoji: '🧀', category: 'Dairy' },
  { id: 'coconut-milk',  name: 'Coconut Milk',  emoji: '🥥', category: 'Dairy' },
  { id: 'oat-milk',      name: 'Oat Milk',      emoji: '🥛', category: 'Dairy' },

  // GRAINS (20)
  { id: 'rice',         name: 'Rice',         emoji: '🍚', category: 'Grains' },
  { id: 'pasta',        name: 'Pasta',        emoji: '🍝', category: 'Grains' },
  { id: 'bread',        name: 'Bread',        emoji: '🍞', category: 'Grains' },
  { id: 'flour',        name: 'Flour',        emoji: '🌾', category: 'Grains' },
  { id: 'oats',         name: 'Oats',         emoji: '🌾', category: 'Grains' },
  { id: 'quinoa',       name: 'Quinoa',       emoji: '🌾', category: 'Grains' },
  { id: 'noodles',      name: 'Noodles',      emoji: '🍜', category: 'Grains' },
  { id: 'couscous',     name: 'Couscous',     emoji: '🌾', category: 'Grains' },
  { id: 'barley',       name: 'Barley',       emoji: '🌾', category: 'Grains' },
  { id: 'breadcrumbs',  name: 'Breadcrumbs',  emoji: '🍞', category: 'Grains' },
  { id: 'cornmeal',     name: 'Cornmeal',     emoji: '🌽', category: 'Grains' },
  { id: 'pita',         name: 'Pita Bread',   emoji: '🫓', category: 'Grains' },
  { id: 'tortilla',     name: 'Tortilla',     emoji: '🫓', category: 'Grains' },
  { id: 'semolina',     name: 'Semolina',     emoji: '🌾', category: 'Grains' },
  { id: 'polenta',      name: 'Polenta',      emoji: '🌽', category: 'Grains' },
  { id: 'rye-bread',    name: 'Rye Bread',    emoji: '🍞', category: 'Grains' },
  { id: 'brown-rice',   name: 'Brown Rice',   emoji: '🍚', category: 'Grains' },
  { id: 'spaghetti',    name: 'Spaghetti',    emoji: '🍝', category: 'Grains' },
  { id: 'penne',        name: 'Penne',        emoji: '🍝', category: 'Grains' },
  { id: 'udon',         name: 'Udon Noodles', emoji: '🍜', category: 'Grains' },

  // SPICES & CONDIMENTS (20)
  { id: 'olive-oil',    name: 'Olive Oil',    emoji: '🫙', category: 'Spices' },
  { id: 'soy-sauce',    name: 'Soy Sauce',    emoji: '🫙', category: 'Spices' },
  { id: 'cumin',        name: 'Cumin',        emoji: '🌶️', category: 'Spices' },
  { id: 'paprika',      name: 'Paprika',      emoji: '🌶️', category: 'Spices' },
  { id: 'turmeric',     name: 'Turmeric',     emoji: '🌿', category: 'Spices' },
  { id: 'chili-flakes', name: 'Chili Flakes', emoji: '🌶️', category: 'Spices' },
  { id: 'ginger',       name: 'Ginger',       emoji: '🫚', category: 'Spices' },
  { id: 'cinnamon',     name: 'Cinnamon',     emoji: '🌿', category: 'Spices' },
  { id: 'oregano',      name: 'Oregano',      emoji: '🌿', category: 'Spices' },
  { id: 'basil',        name: 'Basil',        emoji: '🌿', category: 'Spices' },
  { id: 'honey',        name: 'Honey',        emoji: '🍯', category: 'Spices' },
  { id: 'lemon',        name: 'Lemon',        emoji: '🍋', category: 'Spices' },
  { id: 'vinegar',      name: 'Vinegar',      emoji: '🫙', category: 'Spices' },
  { id: 'mustard',      name: 'Mustard',      emoji: '🫙', category: 'Spices' },
  { id: 'ketchup',      name: 'Ketchup',      emoji: '🍅', category: 'Spices' },
  { id: 'coconut-oil',  name: 'Coconut Oil',  emoji: '🥥', category: 'Spices' },
  { id: 'sesame-oil',   name: 'Sesame Oil',   emoji: '🫙', category: 'Spices' },
  { id: 'thyme',        name: 'Thyme',        emoji: '🌿', category: 'Spices' },
  { id: 'rosemary',     name: 'Rosemary',     emoji: '🌿', category: 'Spices' },
  { id: 'bay-leaves',   name: 'Bay Leaves',   emoji: '🌿', category: 'Spices' },
];

/**
 * CATEGORIES — ordered list of category display names.
 * Used to render category section headers in the grid.
 * @type {string[]}
 */
export const CATEGORIES = [
  'Vegetables',
  'Proteins',
  'Dairy',
  'Grains',
  'Spices',
];

/**
 * Returns ingredients filtered by category.
 * @param {string} category
 * @returns {Ingredient[]}
 */
export function getByCategory(category) {
  return INGREDIENTS.filter((i) => i.category === category);
}
