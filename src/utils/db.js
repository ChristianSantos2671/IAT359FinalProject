import { openDatabaseAsync } from "expo-sqlite";

let dbPromise;

export function getDb() {
  if (!dbPromise) dbPromise = openDatabaseAsync('app.db');
  return dbPromise;
}

// Initialize recipes table
export async function initRecipesTable() {
  const db = await getDb();

  // Create table (with all columns, works for brand-new installs)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      ingredients TEXT NOT NULL,
      instructions TEXT NOT NULL,
      image_uri TEXT,
      category TEXT,
      area TEXT,
      tags TEXT,
      is_favourite INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL
    );
  `);

  // Run migrations for users who already had the old DB
  const migrationSQL = [
    `ALTER TABLE recipes ADD COLUMN image_uri TEXT;`,
    `ALTER TABLE recipes ADD COLUMN category TEXT;`,
    `ALTER TABLE recipes ADD COLUMN area TEXT;`,
    `ALTER TABLE recipes ADD COLUMN tags TEXT;`
  ];

  for (let sql of migrationSQL) {
    try {
      await db.execAsync(sql);
    } catch (e) {
      // Ignore errors for duplicate columns
      if (!e.message?.includes("duplicate column name")) {
        console.error("Migration error:", e);
      }
    }
  }
}

// Get all recipes
export async function getRecipes() {
  const db = await getDb();
  return await db.getAllAsync("SELECT * FROM recipes ORDER BY created_at DESC;");
}

// Save new recipe
export async function saveRecipe(recipe) {
  const db = await getDb();

  const {
    name,
    ingredients,
    instructions,
    image_uri = "",
    category = "",
    area = "",
    tags = "",
    is_favourite = 0
  } = recipe;

  const created_at = Date.now();

  await db.runAsync(
    `INSERT INTO recipes 
      (name, ingredients, instructions, image_uri, category, area, tags, is_favourite, created_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, ingredients, instructions, image_uri, category, area, tags, is_favourite, created_at]
  );

  return true;
}

// Remove a recipe
export async function removeRecipe(recipeId) {
  const db = await getDb();
  await db.runAsync("DELETE FROM recipes WHERE id = ?;", [recipeId]);
  return true;
}

// Toggle favourite
export async function toggleFavourite(recipeId, currentValue) {
  const db = await getDb();
  const newValue = currentValue === 1 ? 0 : 1;
  await db.runAsync("UPDATE recipes SET is_favourite = ? WHERE id = ?;", [newValue, recipeId]);
  return newValue;
}

// Get favourite recipes only
export async function getFavourites() {
  const db = await getDb();
  return await db.getAllAsync("SELECT * FROM recipes WHERE is_favourite = 1 ORDER BY created_at DESC;");
}
