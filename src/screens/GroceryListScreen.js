import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";

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
    <View style={globalStyles.mainView}>
      <ScrollView>
        {/* Placeholder section for potential camera or image upload */}
        <View>
          {/* Camera access or upload photo here */}
        </View>

        {/* Add ingredient input and "+" button */}
        <View style={[globalStyles.view, styles.addIngriedientSection]}>
          <TextInput 
            style={[globalStyles.textInput, styles.enterIngridientInput]} 
            placeholder="Enter Ingredient"
            value={ingredient}
            onChangeText={setIngredient}
            onSubmitEditing={addIngredient}
          />
          <TouchableOpacity 
            style={styles.ingridientButton}
            onPress={addIngredient}
          >
            <Text style={globalStyles.headerText2}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Ingredient list display */}
        <View style={globalStyles.view}>
          <Text style={globalStyles.headerText2}>Recipe Ingredients</Text>
          <FlatList
            style={styles.ingredientsList}
            scrollEnabled={false}
            data={ingredients}
            renderItem={({item, index}) => (
              <View style={styles.tag}>
                {/* Checkbox button (toggles checked/unchecked state) */}
                <TouchableOpacity
                  style={styles.checkButton}
                  onPress={() => toggleIngredient(index)}
                >
                  <Text style={styles.checkmark}>{item.checked ? '✓' : ''}</Text>
                </TouchableOpacity>

                {/* Ingredient title (crossed out if checked) */}
                <Text style={[
                  styles.ingridientName,
                  item.checked && styles.checkedText
                ]}>
                  {item.title}
                </Text>

                {/* Delete ingredient (✕) */}
                <TouchableOpacity onPress={() => deleteIngredient(index)}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </ScrollView>

      {/* Floating button (bottom right) — navigates to Log Meal screen */}
      <TouchableOpacity
        style={globalStyles.logMealButton}
        onPress={() => navigation.navigate('Log Meal')}
      >
        <Image
          style={globalStyles.logMealImage}
          source={require('../../assets/adaptive-icon.png')}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  addIngriedientSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 0,
  },
  enterIngridientInput: {
    flex: 1,
  },
  ingridientButton: {
    backgroundColor: globalStyles.colors.primary,
    borderWidth: globalStyles.buttonValues.buttonBorderWidth,
    borderRadius: globalStyles.buttonValues.buttonBorderRadius,
    padding: globalStyles.buttonValues.buttonPadding,
    margin: globalStyles.buttonValues.buttonMargin,
  },
  ingredientsList: {
    borderWidth: globalStyles.sectionValues.sectionBorderWidth,
    backgroundColor: globalStyles.colors.backgroundSecondary,
    marginTop: 10,
    padding: globalStyles.sectionValues.sectionPadding,
  },
  tag: {
    backgroundColor: globalStyles.colors.primary,
    borderRadius: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 6,
    marginHorizontal: 10,
  },
  checkButton: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: globalStyles.colors.text,
    borderRadius: 12,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: globalStyles.colors.background,
  },
  checkmark: {
    color: globalStyles.colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  ingridientName: {
    flex: 1,
    flexShrink: 1,
    flexWrap: 'wrap',
    fontSize: globalStyles.tagText.fontSize,
    marginRight: 8,
    color: globalStyles.colors.text,
    textAlignVertical: 'top',
  },
  closeButton: {
    alignSelf: 'center',
    paddingLeft: 8,
  },
});
