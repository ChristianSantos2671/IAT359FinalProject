import AsyncStorage from '@react-native-async-storage/async-storage';

// Store JSON data.

// Store JSON data.

// Store JSON data.
export async function storeData(key, value) {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (e) {
    console.error("Error storing data", e);
    return false;
  }
}

// Retrieve all meals.

// Retrieve all meals.

// Retrieve all meals.
export async function getMeals() {
  try {
    const jsonValue = await AsyncStorage.getItem('@meals');
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Error reading meals", e);
    return [];
  }
}

// Save a new meal.

// Save a new meal.

// Save a new meal.
export async function saveMeal(meal) {
  try {
    const meals = await getMeals();
    meals.unshift(meal);
    await storeData('@meals', meals);
    return true;
  } catch (e) {
    console.error("Error saving meal", e);
    return false;
  }
}

// Remove a meal by its timestamp.

// Remove a meal by its timestamp.

// Remove a meal by its timestamp.
export async function removeMeal(mealId) {
  try {
    const storedMeals = await AsyncStorage.getItem('@meals');
    if (!storedMeals) return false;

    const meals = JSON.parse(storedMeals);
    const updatedMeals = meals.filter(meal => meal.timestamp !== mealId);

    await AsyncStorage.setItem('@meals', JSON.stringify(updatedMeals));
    return true;
  } catch (error) {
    console.error('Error removing meal:', error);
    return false;
  }
}
