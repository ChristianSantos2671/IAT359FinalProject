import { toggleFavourite } from "./db";

/**
 * Wrapper function to toggle the favourite status of a recipe.
 * This provides an additional abstraction layer over the lower-level
 * `toggleFavourite()` function in `db.js`, allowing safe toggling
 * and consistent error handling for UI-level components.
 * Behaviour:
 *  - If the recipe is currently favourited (1), it becomes unfavourited (0).
 *  - If it’s not favourited (0), it becomes favourited (1).
 */
export async function toggleRecipeFavourite(recipeId, currentValue) {
  // Determine the new favourite state (flip 0 ↔ 1).
  const newValue = currentValue === 1 ? 0 : 1;

  try {
    // Update the favourite state in the SQLite database.
    await toggleFavourite(recipeId, newValue);
    return newValue;
  } catch (error) {
    // Handle database or runtime errors gracefully.
    console.error("Error toggling favourite:", error);
    return currentValue; // Fallback to previous value if update fails.
  }
}
