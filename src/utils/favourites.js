import { toggleFavourite } from "./db";

// Toggles a recipe's favourite status in the database.
// Returns the new favourite value (0 or 1).
export async function toggleRecipeFavourite(recipeId, currentValue) {
  const newValue = currentValue === 1 ? 0 : 1;

  try {
    await toggleFavourite(recipeId, newValue);
    return newValue;
  } catch (error) {
    console.error("Error toggling favourite:", error);
    return currentValue; // fallback if error
  }
}
