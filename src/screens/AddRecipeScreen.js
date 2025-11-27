import { Alert, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";

import globalStyles from '../utils/globalStyles';
import { saveRecipe } from '../utils/db';

export default function AddRecipeScreen({ navigation, route }) {
  const photo = route?.params?.photo ?? null;
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [ingredient, setIngredient] = useState('');
  const [instructions, setInstructions] = useState('');
  const [error, setError] = useState('');

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
      
        // Reset form
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
    <View style={globalStyles.mainView}>
      <ScrollView>
        <View>
          {/* Camera access or upload photo here */}
        </View>

        <View style={globalStyles.view}>
          <Text style={globalStyles.headerText2}>Recipe Name</Text>
          <TextInput 
            style={globalStyles.textInput} 
            placeholder="eg. Beef Wellington"
            value={recipeName}
            onChangeText={setRecipeName}
          />
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
                <Text style={styles.ingridientName}>{item}</Text>
                <TouchableOpacity
                  onPress={() => deleteIngredient(index)}
                >
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        <View style={globalStyles.view}>
          <Text style={globalStyles.headerText2}>Instructions</Text>
          <TextInput
            style={globalStyles.textInput}
            multiline={true}
            placeholder="Step 1: ..."
            value={instructions}
            onChangeText={setInstructions}
          />
        </View>

        <View>
          <Image
            style={styles.image}
            source={
              photo && photo.uri
                ? { uri: photo.uri }
                : require('../../assets/adaptive-icon.png')
            }
          />
        </View>
      </ScrollView>

      <View style={styles.uploadButtonSection}>
        <TouchableOpacity
          style={[styles.uploadButton, styles.uploadImageButton]}
          onPress={() => navigation.navigate('CameraScreen', { previousScreen: 'Add Recipe' })}
        >
          <Text style={globalStyles.headerText2}>Upload Image</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={uploadRecipe}
        >
          <Text style={globalStyles.headerText2}>Upload Recipe</Text>
        </TouchableOpacity>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: '100%',
    height: 150,
    marginVertical: globalStyles.sectionValues.sectionMargin,
    resizeMode: 'contain',
  },
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
  ingridientName: {
    fontSize: globalStyles.tagText.fontSize,
    marginRight: 5,
  },
  closeButton: {
    padding: 2,
  },
  uploadButtonSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  uploadButton: {
    backgroundColor: globalStyles.colors.primary,
    borderWidth: globalStyles.buttonValues.buttonBorderWidth,
    borderRadius: globalStyles.buttonValues.buttonBorderRadius,
    paddingVertical: globalStyles.buttonValues.buttonPadding,
    paddingHorizontal: 100,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadImageButton: {
    marginHorizontal: globalStyles.buttonValues.buttonMargin * 3,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    textAlign: 'center',
  },
});
