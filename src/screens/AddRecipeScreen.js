import { Alert, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";

import globalStyles from '../utils/globalStyles';
import { saveRecipe } from '../utils/db';
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function AddRecipeScreen({ navigation, route }) {
  
  const photo = route?.params?.photo ?? null;
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [ingredient, setIngredient] = useState('');
  const [instructions, setInstructions] = useState('');
  const [error, setError] = useState('');
  const insets = useSafeAreaInsets();
  

  const addIngredient = () => {
    if (ingredient.trim()) {
      setIngredients([...ingredients, ingredient.trim()]);
      setIngredient('');
    }
  };

  const deleteIngredient = (index) => {
    let newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  }

    const validateForm = () => {
      if (!recipeName.trim()) {
        setError('Please enter a recipe name');
        return false;
      }

      if (ingredients.length === 0) {
        setError('Please add at least one ingredient');
        return false;
      }

      if (!instructions.trim()) {
        setError('Please add recipe instructions');
        return false;
      }

      return true;
    };

    const uploadRecipe = async () => {
      try {
        if (!validateForm()) {
          return;
        }

        const recipe = {
          name: recipeName.trim(),
          ingredients: ingredients.join(', '),
          instructions: instructions.trim(),
          image_uri: photo?.uri ?? '',
        };

        await saveRecipe(recipe);
      
        // Reset form fields
        setRecipeName('');
        setIngredients([]);
        setInstructions('');
        setError('');

        Alert.alert(
          'Success',
          'Recipe uploaded successfully!',
        );
        navigation.navigate("Profile", { activeTab: "My Recipes" });
      } catch (e) {
        setError('Failed to upload recipe. Please try again.');
        console.error('Error uploading recipe:', e);
      }
    };
  
return (
  <View style={globalStyles.container}>
    
    {/* Top Header */}
    <View style={[globalStyles.topContainer, globalStyles.paddingHorizontal, { paddingTop: insets.top + 5 }]}>
      <Text style={[globalStyles.h1, globalStyles.textMargins]}>Add Recipe</Text>
      <Text style={[globalStyles.subheadingstyles, globalStyles.textMargins]}>
        Add a name, ingredients, instructions, and an image.
      </Text>
      
      {/* Recipe Name Input */}
      <Text style={globalStyles.h3}>Recipe name</Text>
      <TextInput
        placeholder="Enter recipe name"
        style={[globalStyles.input, { marginTop: 10 }]}
        value={recipeName}
        onChangeText={setRecipeName}
      />

      {/* Add Ingredients section by pressing the button */}
      <Text style={globalStyles.h3}>Ingredients</Text>

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

    <ScrollView style={globalStyles.paddingHorizontal}>
      
      {/* Ingredient list display */}
      <Text style={[globalStyles.h3, { marginVertical: 10 }]}>All ingredients</Text>

      <FlatList
        scrollEnabled={false}
        data={ingredients}
        renderItem={({ item, index }) => (
          <View style={styles.tag}>
            <Text style={styles.ingredientName}>{item}</Text>
            <TouchableOpacity onPress={() => deleteIngredient(index)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Recipe instructions input */}
      <Text style={[globalStyles.h3, { marginTop: 20 }]}>Instructions</Text>
      <TextInput
        style={[globalStyles.input, { height: 120, textAlignVertical: "top" }]}
        multiline
        placeholder="Step 1..."
        value={instructions}
        onChangeText={setInstructions}
      />

      {/*Recipe image preview, it will be empty until an image is uploaded*/}
      {photo && photo.uri ? (
        <Image
          style={styles.image}
          source={{ uri: photo.uri }}
        />
      ) : null}

      {/* show error message if the field are not there */}
      {error ? <Text style={{ color: 'red', marginVertical: 10 }}>{error}</Text> : null}

      {/* Grouping buttons here */}
      <View style={{ marginVertical: 30 }}>
      
      {/* Button to upload image */}
        <TouchableOpacity
          style={[globalStyles.secondaryButton, { marginBottom: 10 }]}
          onPress={() => navigation.navigate('CameraScreen', { previousScreen: 'Add Recipe' })}
        >
          <Text style={globalStyles.secondaryButtonText}>Upload Image</Text>
        </TouchableOpacity>
        
        {/* Button to upload recipe to the database */}
        <TouchableOpacity
          style={globalStyles.primaryButton}
          onPress={uploadRecipe}
        >
          <Text style={globalStyles.primaryButtonText}>Upload Recipe</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  </View>
);
}

const styles = StyleSheet.create({

  // layout for adding ingredients section
  addIngredientContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 15,
  },

  // spacing for add ingredients input

  enterIngredientInput: {
    flex: 9,
  },

  // styling for adding ingredients button
  addButton: {
    backgroundColor: globalStyles.colors.primary,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },

  //Ingredient Tag styling
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

  // styling for the ingredient name 
  ingredientName: {
    flex: 1,
    flexWrap: "wrap",
    fontSize: globalStyles.tagText.fontSize,
    marginRight: 8,
    color: globalStyles.colors.text,
  },

  // delete button styling
  closeButton: {
    fontSize: 18,
    paddingLeft: 10,
    color: globalStyles.colors.primary,
  },

  //Instructions Image 
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginTop: 20,
    borderRadius: 12,
    backgroundColor: globalStyles.colors.backgroundSecondary,
  },

  // spacing for upload button
  uploadImageButton: {
    marginBottom: 10,
  },

  // styling for error text
  errorText: {
    color: 'red',
    marginTop: 5,
    textAlign: 'center',
  },
});
