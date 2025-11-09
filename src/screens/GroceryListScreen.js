import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";

import globalStyles from '../utils/globalStyles';

export default function GroceryListScreen() {
  const [ingredients, setIngredients] = useState([]);
  const [ingredient, setIngredient] = useState('');

  const addIngredient = () => {
    if (ingredient.trim()) {
      setIngredients([...ingredients, { 
        title: ingredient.trim(),
        checked: false
      }]);
      setIngredient('');
    }
  };

  const toggleIngredient = (index) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = {
      ...newIngredients[index],
      checked: !newIngredients[index].checked
    };
    setIngredients(newIngredients);
  };

  const deleteIngredient = (index) => {
    let newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  }
  
  return (
    <View style={globalStyles.mainView}>
      <ScrollView>
        <View>
          {/* Camera access or upload photo here */}
        </View>

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

        <View style={globalStyles.view}>
          <Text style={globalStyles.headerText2}>Recipe Ingrdients</Text>
          <FlatList
            style={styles.ingredientsList}
            scrollEnabled={false}
            data={ingredients}
            renderItem={({item, index}) => (
              <View style={styles.tag}>
                <TouchableOpacity
                  style={styles.checkButton}
                  onPress={() => toggleIngredient(index)}
                >
                  <Text style={styles.checkmark}>{item.checked ? '✓' : ''}</Text>
                </TouchableOpacity>
                <Text style={[
                  styles.ingridientName,
                  item.checked && styles.checkedText
                ]}>{item.title}</Text>
                <TouchableOpacity
                  onPress={() => deleteIngredient(index)}
                >
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </ScrollView>

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
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 16,
    backgroundColor: globalStyles.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 10,
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
    fontSize: globalStyles.tagText.fontSize,
    marginRight: 5,
  },
  closeButton: {
    padding: 2,
  },
});