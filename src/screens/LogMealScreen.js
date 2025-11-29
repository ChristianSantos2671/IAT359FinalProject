import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import globalStyles from '../utils/globalStyles';
import { saveMeal } from "../utils/storage";

/**
 * This screen allows the user to log a meal they cooked or ate.
 * Users can:
 *  - Enter a recipe name
 *  - Add the recipe steps
 *  - Share their personal experience
 *  - Upload a photo of the meal (via CameraScreen)
 * 
 * The meal data is saved locally (via saveMeal) and appears under
 * the “My Logged Meals” tab in the Profile screen.
 */
export default function LogMealScreen({ navigation, route }) {
  const { photo } = route.params;
  const [recipeName, setRecipeName] = useState('');
  const [recipe, setRecipe] = useState('');
  const [experience, setExperience] = useState('');
  const [error, setError] = useState('');
  const insets = useSafeAreaInsets();

  /**
   * Validates the form and, if valid:
   * - Creates a meal object with recipe details and photo URI.
   * - Saves it locally using saveMeal().
   * - Clears input fields and navigates back to the Profile screen.
   * Displays an error if validation or saving fails.
   */
  const uploadMeal = async () => {
    setError('');

    // Validate user input.
    if (!recipeName.trim()) {
      setError('Please enter a recipe name');
      return;
    }
    if (!recipe.trim()) {
      setError('Please enter the recipe');
      return;
    }
    if (!experience.trim()) {
      setError('Please share your experience');
      return;
    }
    if (photo === '../../assets/adaptive-icon.png') {
      setError('Please take a photo of the meal');
      return;
    }

    // Construct meal object.
    const newMeal = {
      name: recipeName.trim(),
      recipe: recipe.trim(),
      experience: experience.trim(),
      timestamp: Date.now(),
      photo: photo.uri,
    };

    try {
      // Save the meal locally using utility function.
      const success = await saveMeal(newMeal);

      if (success) {
        // Clear all fields and show success message.
        setRecipeName('');
        setRecipe('');
        setExperience('');
        Alert.alert('Success', 'Meal uploaded successfully!');
        
        // Redirect user to the "My Logged Meals" tab in Profile.
        navigation.navigate("Profile", { activeTab: "My Logged Meals" });
      } else {
        setError('Failed to save meal. Please try again.');
      }
    } catch (e) {
      // Handle unexpected database or file errors.
      setError('Failed to save meal. Please try again.');
      console.error('Error saving meal:', e);
    }
  };

	return (
		<View style={globalStyles.mainView}>
      <ScrollView>
        {/* Recipe Name Field */}
        <View style={globalStyles.view}>
          <Text style={globalStyles.headerText2}>Recipe Name</Text>
          <TextInput 
            style={globalStyles.textInput} 
            placeholder="eg. Beef Wellington"
            value={recipeName}
            onChangeText={setRecipeName}
          />
        </View>

        {/* Recipe Steps Field */}
        <View style={globalStyles.view}>
          <Text style={globalStyles.headerText2}>Recipe</Text>
          <TextInput
            style={globalStyles.textInput}
            multiline={true}
            placeholder="Step 1: ..."
            value={recipe}
            onChangeText={setRecipe}
          />
        </View>

        {/* Experience Field */}
        <View style={globalStyles.view}>
          <Text style={globalStyles.headerText2}>My Experience</Text>
          <TextInput
            style={globalStyles.textInput}
            multiline={true}
            placeholder="This recipe was delicious because..."
            value={experience}
            onChangeText={setExperience}
          />
        </View>

        {/* Meal Image + Upload Button */}
        <View>
          <Image
            style={styles.image}
            source={
              photo === '../../assets/adaptive-icon.png'
                ? require('../../assets/adaptive-icon.png')
                : { uri: photo.uri }
            }
          />
          <TouchableOpacity
            style={[styles.uploadButton, styles.uploadImageButton]}
            onPress={() =>
              navigation.navigate('CameraScreen', { previousScreen: 'Log Meal' })
            }
          >
            <Text style={globalStyles.headerText2}>Upload Image</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Upload Meal Button (fixed at bottom) */}
      <View style={[styles.uploadButtonSection, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity style={styles.uploadButton} onPress={uploadMeal}>
          <Text style={globalStyles.headerText2}>Upload My Meal</Text>
        </TouchableOpacity>

        {/* Error message display */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadImageButton: {
    marginHorizontal: globalStyles.buttonValues.buttonMargin * 3,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});
