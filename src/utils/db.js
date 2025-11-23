import { openDatabaseAsync } from "expo-sqlite";

let dbPromise;

export function getDb() {
  if (!dbPromise) dbPromise = openDatabaseAsync('app.db');
  return dbPromise;
}

// Initialize recipes table
export async function initRecipesTable() {
  const db = await getDb();

  // Create table if it doesn't exist
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      ingredients TEXT NOT NULL,
      instructions TEXT NOT NULL,
      is_favourite INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL
    );
  `);

  // Add image_uri column if it doesn't exist
  try {
    await db.execAsync(`
      ALTER TABLE recipes
      ADD COLUMN image_uri TEXT;
    `);
  } catch (e) {
    try {
      // Ignore error if column already exists
      if (!e.message.includes('duplicate column name')) {
        throw e;
      }
    } catch (innerError) {
      console.error("Error adding image_uri column:", innerError);
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
  const { name, ingredients, instructions, image_uri } = recipe;
  const created_at = Date.now();

  await db.runAsync(
    "INSERT INTO recipes (name, ingredients, instructions, image_uri, created_at) VALUES (?, ?, ?, ?, ?);",
    [name, ingredients, instructions, image_uri || '', created_at]
  );
  return true;
}

// Remove a recipe
export async function removeRecipe(recipeId) {
  const db = await getDb();
  await db.runAsync("DELETE FROM recipes WHERE id = ?;", [recipeId]);
  return true;
}

export async function toggleFavourite(recipeId, currentValue) {
  const db = await getDb();
  const newValue = currentValue === 1 ? 0 : 1;
  await db.runAsync("UPDATE recipes SET is_favourite = ? WHERE id = ?;", [newValue, recipeId]);
  return newValue;
}

// Get only favourite recipes
export async function getFavourites() {
  const db = await getDb();
  return await db.getAllAsync("SELECT * FROM recipes WHERE is_favourite = 1 ORDER BY created_at DESC;");
}
