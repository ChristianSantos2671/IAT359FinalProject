import { openDatabaseAsync } from "expo-sqlite";

let dbPromise;

export function getDb() {
    if (!dbPromise) dbPromise = openDatabaseAsync('app db')
        return dbPromise;
}

export async function intNotesTable() {
    const db = await getDb();

    await db.execAsync(
        `
        CREATE TABLE IF NOT EXISTS my_notes (
            id INTEGER PRIMARY KEY NOT NULL
            note TEXT NOT NULL
        );
        `
    );
}

export async function fetchNotes() {
    const db = await getDb();

    return db.getAllAsync("SELECT * FROM my_notes ORDER BY id DESC;")
}

export async function insertNote() {
    const db = await getDb();
    
    await db.runAsync("INSERT INTO my_notes (note) VALUES (?);", {note});
}

export async function removeMote () {
    const db = await getDb();

    await db.runAsync("DELETE FROM my_notes WHERE id = ?;", {id});
}

export async function resetNotes () {
    const db = await getDb();

    await db.runAsync("DELETE FROM my_notes;");
}