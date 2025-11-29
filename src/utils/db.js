import { openDatabaseAsync } from "expo-sqlite";

let dbPromise;

/**
 * Opens (or returns an existing reference to) the SQLite database.
 * The function ensures a single shared connection using a cached promise.
 */
export function getDb() {
  if (!dbPromise) dbPromise = openDatabaseAsync('app.db');
  return dbPromise;
}

/**
 * Initializes the main `recipes` table in the database if it doesn't exist.
 * Also attempts to add an `image_uri` column if it's missing.
 * Table schema:
 *  - id: unique integer ID (auto-incremented)
 *  - name: recipe name (text)
 *  - ingredients: list or description of ingredients (text)
 *  - instructions: cooking steps (text)
 *  - is_favourite: 0 or 1 (boolean flag)
 *  - created_at: timestamp in milliseconds (integer)
 *  - image_uri: optional image path or URL (text)
 */
export async function initRecipesTable() {
  const db = await getDb();

  // Create the table if it doesn’t exist already.
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

  // Add image_uri column if it doesn't already exist (ignores duplicate errors).
  try {
    await db.execAsync(`
      ALTER TABLE recipes
      ADD COLUMN image_uri TEXT;
    `);
  } catch (e) {
    try {
      // Ignore “duplicate column name” errors, throw others.
      if (!e.message.includes('duplicate column name')) {
        throw e;
      }
    } catch (innerError) {
      console.error("Error adding image_uri column:", innerError);
    }
  }
}

/**
 * Retrieves all recipes (both favourite and non-favourite).
 * sorted by creation date (newest first).
 */
export async function getRecipes() {
  const db = await getDb();
  return await db.getAllAsync(
    "SELECT * FROM recipes ORDER BY created_at DESC;"
  );
}

/**
 * Inserts a new recipe record into the database.
 * Automatically sets a creation timestamp.
 */
export async function saveRecipe(recipe) {
  const db = await getDb();
  const { name, ingredients, instructions, image_uri, is_favourite = 0 } = recipe;
  const created_at = Date.now();

  await db.runAsync(
    `
    INSERT INTO recipes 
      (name, ingredients, instructions, image_uri, is_favourite, created_at) 
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [name, ingredients, instructions, image_uri || '', is_favourite, created_at]
  );

  return true;
}

/**
 * Deletes a recipe row from the database by ID.
 */
export async function removeRecipe(recipeId) {
  const db = await getDb();
  await db.runAsync("DELETE FROM recipes WHERE id = ?;", [recipeId]);
  return true;
}

/**
 * Toggles the `is_favourite` flag for a given recipe.
 * Updates the value between 1 (favourite) and 0 (not favourite).
 */
export async function toggleFavourite(recipeId, currentValue) {
  const db = await getDb();
  const newValue = currentValue === 1 ? 0 : 1;
  await db.runAsync(
    "UPDATE recipes SET is_favourite = ? WHERE id = ?;",
    [newValue, recipeId]
  );
  return newValue;
}

/**
 * Retrieves only recipes marked as favourites.
 * Sorted by creation date (newest first).
 */
export async function getFavourites() {
  const db = await getDb();
  return await db.getAllAsync(
    "SELECT * FROM recipes WHERE is_favourite = 1 ORDER BY created_at DESC;"
  );
}
