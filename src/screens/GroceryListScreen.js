import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";



import globalStyles from '../utils/globalStyles';

export default function GroceryListScreen({navigation, route}) {
  const [ingredients, setIngredients] = useState([]);
  const [ingredient, setIngredient] = useState('');
  const insets = useSafeAreaInsets();
  

  useEffect(() => {
    if (route?.params?.ingredients) {
      const initialIngredients = route.params.ingredients.map(item => ({
        title: item,
        checked: false
      }));
      setIngredients(initialIngredients);
    }
  }, [route?.params?.ingredients]);

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
  <View style={globalStyles.container}>
    
    {/* Top Header */}
    <View style={[globalStyles.topContainer, globalStyles.paddingHorizontal, { paddingTop: insets.top + 5 }]}>
      <Text style={[globalStyles.h1, globalStyles.textMargins]}>Grocery List</Text>
      <Text style={[globalStyles.subheadingstyles, globalStyles.textMargins]}>
        Add, check off, and manage your recipe ingredients.
      </Text>

      {/* Add Ingredient Bar */}
      <View style={styles.addIngredientContainer}>
        <TextInput
          placeholder="Enter Ingredient"
          style={[globalStyles.input, styles.enterIngredientInput]}
          value={ingredient}
          onChangeText={setIngredient}
          onSubmitEditing={addIngredient}
        />
        <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
          <Text style={[globalStyles.h2, { color: "#fff" }]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>

    {/* Ingredient List */}
    <ScrollView style={globalStyles.paddingHorizontal}>
      <Text style={[globalStyles.h3, { marginVertical: 10 }]}>Recipe Ingredients</Text>

      <View>
        <FlatList
          scrollEnabled={false}
          data={ingredients}
          renderItem={({ item, index }) => (
            <View style={styles.tag}>
              <TouchableOpacity
                style={styles.checkButton}
                onPress={() => toggleIngredient(index)}
              >
                <Text style={styles.checkmark}>{item.checked ? "●" : ""}</Text>
              </TouchableOpacity>

              <Text style={[styles.ingredientName, item.checked && styles.checkedText]}>
                {item.title}
              </Text>

              <TouchableOpacity onPress={() => deleteIngredient(index)}>
                <Text style={styles.h3}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </ScrollView>

    {/* Floating Button */}
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

  addIngredientContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 15,
  },

  enterIngredientInput: {
    flex: 9,
  },

  addButton: {
    backgroundColor: globalStyles.colors.primary,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
    alignSelf: 'center'
  },


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

  checkmark: {
    color: globalStyles.colors.primary,
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
    justifyContent: "center"
  },

  ingredientName: {
    flex: 1,
    flexWrap: "wrap",
    fontSize: globalStyles.tagText.fontSize,
    marginRight: 8,
    color: globalStyles.colors.text,
  },

  checkedText: {
    textDecorationLine: "line-through",
    opacity: 0.7,
  },

  closeButton: {
    fontSize: 18,
    paddingLeft: 10,
    color: globalStyles.colors.primary,
  },
});