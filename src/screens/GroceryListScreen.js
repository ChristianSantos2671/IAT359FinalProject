import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";



import globalStyles from '../utils/globalStyles';

/**
 * This screen lets the user build and manage a grocery list.
 * Users can:
 * - Import ingredients from another screen (e.g., a recipe).
 * - Add new ingredients manually.
 * - Check/uncheck ingredients as completed.
 * - Delete ingredients from the list.
 */
export default function GroceryListScreen({ navigation, route }) {
  const [ingredients, setIngredients] = useState([]);
  const [ingredient, setIngredient] = useState('');
  const insets = useSafeAreaInsets();
  

  /**
   * If this screen was opened with a list of ingredients (via route.params),
   * map each ingredient string into an object with `title` and `checked` state.
   * Runs again if route params change.
   */
  useEffect(() => {
    if (route?.params?.ingredients) {
      const initialIngredients = route.params.ingredients.map(item => ({
        title: item,
        checked: false
      }));
      setIngredients(initialIngredients);
    }
  }, [route?.params?.ingredients]);

  /**
   * Adds a new ingredient from the TextInput field to the list.
   * - Trims whitespace.
   * - Resets the input field after adding.
   */
  const addIngredient = () => {
    if (ingredient.trim()) {
      setIngredients([...ingredients, { 
        title: ingredient.trim(),
        checked: false
      }]);
      setIngredient('');
    }
  };

  /**
   * Marks an ingredient as checked/unchecked when the user taps the checkbox.
   */
  const toggleIngredient = (index) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = {
      ...newIngredients[index],
      checked: !newIngredients[index].checked
    };
    setIngredients(newIngredients);
  };

  /**
   * Removes an ingredient from the list at a specific index.
   */
  const deleteIngredient = (index) => {
    let newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };
  
return (
  <View style={globalStyles.container}>
    
    {/* Top Header */}
    <View style={[globalStyles.topContainer, globalStyles.paddingHorizontal, { paddingTop: insets.top + 5 }]}>
      <Text style={[globalStyles.h1, globalStyles.textMargins]}>Grocery List</Text>
      <Text style={[globalStyles.subheadingstyles, globalStyles.textMargins]}>
        Add, check off, and manage your recipe ingredients.
      </Text>

      {/* Ingredients input field */}
      <View style={styles.addIngredientContainer}>
        <TextInput
          placeholder="Enter Ingredient"
          style={[globalStyles.input, styles.enterIngredientInput]}
          value={ingredient}
          onChangeText={setIngredient}
          onSubmitEditing={addIngredient}
        />
        {/* Button to add ingredients from input */}
        <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
          <Text style={[globalStyles.h2, { color: "#fff" }]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>

    {/* Ingredient List display */}
    <ScrollView style={globalStyles.paddingHorizontal}>
      <Text style={[globalStyles.h3, { marginVertical: 10 }]}>Recipe Ingredients</Text>

      <View>
        <FlatList
          scrollEnabled={false}
          data={ingredients}
          renderItem={({ item, index }) => (
            <View style={styles.tag}>
              {/* Checkbox button (toggles checked/unchecked state) */}
              <TouchableOpacity
                style={styles.checkButton}
                onPress={() => toggleIngredient(index)}
              >
                <Text style={styles.checkmark}>{item.checked ? "●" : ""}</Text>
              </TouchableOpacity>

              {/* Ingredient title (crossed out if checked) */}
              <Text style={[styles.ingredientName, item.checked && styles.checkedText]}>
                {item.title}
              </Text>

              {/* Delete ingredient (✕) */}
              <TouchableOpacity onPress={() => deleteIngredient(index)}>
                <Text style={styles.h3}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </ScrollView>

      {/* Floating button (bottom right) — navigates to Log Meal screen */}
      <TouchableOpacity
        style={globalStyles.logMealButton}
        onPress={() => navigation.navigate('Log Meal', {previousScreen: 'Home', photo: '../../assets/adaptive-icon.png'})}
      >
        <Ionicons 
          name="journal-outline" 
          size={32} 
          color="#ffffff"
        />
        <Text style={[globalStyles.h3, {color: "white"}]}>+</Text>
      </TouchableOpacity>
  </View>
);
}


const styles = StyleSheet.create({

  // spacing for adding an ingredient
  addIngredientContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 15,
  },

  // spacing for ingredient input
  enterIngredientInput: {
    flex: 9,
  },

  // styling + spacing for adding an ingredient button
  addButton: {
    backgroundColor: globalStyles.colors.primary,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
    alignSelf: 'center'
  },

  // styling + layout of the ingredient tags / outputs
  tag: {
    backgroundColor: globalStyles.colors.secondary,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 6,
  },

  // styling for checked button
  checkButton: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: globalStyles.colors.primary,
    borderRadius: 12,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: globalStyles.colors.background,
  },

  // styling one item as been checked
  checkmark: {
    color: globalStyles.colors.primary,
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
    justifyContent: "center"
  },

  // Ingredient name styling
  ingredientName: {
    flex: 1,
    flexWrap: "wrap",
    fontSize: globalStyles.tagText.fontSize,
    marginRight: 8,
    color: globalStyles.colors.text,
  },

  // checked text styling
  checkedText: {
    textDecorationLine: "line-through",
    opacity: 0.7,
  },

  // styling for the X or delete button
  closeButton: {
    fontSize: 18,
    paddingLeft: 10,
    color: globalStyles.colors.primary,
  },
});