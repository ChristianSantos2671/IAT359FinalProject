import { openDatabaseAsync } from "expo-sqlite";

let dbPromise;

export function getDb() {
    if (!dbPromise) dbPromise = openDatabaseAsync('app.db');
    return dbPromise;
}

export async function initNotesTable() {
    const db = await getDb();

    await db.execAsync(
        `
        CREATE TABLE IF NOT EXISTS my_notes (
            id INTEGER PRIMARY KEY NOT NULL,
            note TEXT NOT NULL
        );
        `
    );
}

export async function initRecipesTable() {
    const db = await getDb();

    await db.execAsync(
        `
        CREATE TABLE IF NOT EXISTS recipes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            ingredients TEXT NOT NULL,
            instructions TEXT NOT NULL,
            is_favourite INTEGER DEFAULT 0,
            created_at INTEGER NOT NULL
        );
        `
    );
}

export async function fetchNotes() {
    const db = await getDb();

    return db.getAllAsync("SELECT * FROM my_notes ORDER BY id DESC;")
}

export async function insertNote(note) {
    const db = await getDb();
    
    await db.runAsync("INSERT INTO my_notes (note) VALUES (?);", [note]);
}

export async function removeNote(id) {
    const db = await getDb();

    await db.runAsync("DELETE FROM my_notes WHERE id = ?;", [id]);
}

export async function resetNotes() {
    const db = await getDb();

    await db.runAsync("DELETE FROM my_notes;");
}

// Recipe functions
export async function getRecipes() {
    const db = await getDb();
    return await db.getAllAsync("SELECT * FROM recipes ORDER BY created_at DESC;");
}

export async function saveRecipe(recipe) {
    const db = await getDb();
    const { name, ingredients, instructions } = recipe;
    const created_at = Date.now();
    
    await db.runAsync(
        "INSERT INTO recipes (name, ingredients, instructions, created_at) VALUES (?, ?, ?, ?);",
        [name, ingredients, instructions, created_at]
    );
    return true;
}

export async function removeRecipe(recipeId) {
    const db = await getDb();
    await db.runAsync("DELETE FROM recipes WHERE id = ?;", [recipeId]);
    return true;
}

export async function toggleFavourite(recipeId, isFavourite) {
    const db = await getDb();
    const newValue = isFavourite ? 1 : 0;
    await db.runAsync("UPDATE recipes SET is_favourite = ? WHERE id = ?;", [newValue, recipeId]);
    return true;
}

export async function getFavourites() {
    const db = await getDb();
    return await db.getAllAsync("SELECT * FROM recipes WHERE is_favourite = 1 ORDER BY created_at DESC;");
}
