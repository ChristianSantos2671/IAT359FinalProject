import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import globalStyles from '../utils/globalStyles';
import { saveMeal } from "../utils/storage";

export default function LogMealScreen({ navigation, route }) {
// pass parameters from faveRecipe details + regular recipe details screen
const { photo, mealName } = route.params || {};
const [recipeName, setRecipeName] = useState(mealName || '');
 // const [recipe, setRecipe] = useState('');
  const [experience, setExperience] = useState('');
  const [error, setError] = useState('');

  const insets = useSafeAreaInsets();

  const uploadMeal = async () => {
    setError('');

    // Validate user input.
    if (!recipeName.trim()) {
      setError('Please enter a recipe name');
      return;
    }

  {/*  if (!recipe.trim()) {
      setError('Please enter the recipe');
      return;
    } */}
    
    if (!experience.trim()) {
      setError('Please share your experience');
      return;
    }
    if (photo === '../../assets/adaptive-icon.png') {
      setError('Please take a photo of the meal');
      return;
    }

    const newMeal = {
      name: recipeName.trim(),
      //recipe: recipe.trim(),
      experience: experience.trim(),
      timestamp: Date.now(),
      photo: photo.uri,
    };

    try {
      const success = await saveMeal(newMeal);
      if (success) {
        setRecipeName('');
        //setRecipe('');
        setExperience('');
        Alert.alert(
          'Success',
          'Meal uploaded successfully!',
        );
        navigation.navigate("Profile", { activeTab: "My Logged Meals" });
      } else {
        setError('Failed to save meal. Please try again.');
      }
    } catch (e) {
      setError('Failed to save meal. Please try again.');
      console.error('Error saving meal:', e);
    }
  };

return (
  <View style={globalStyles.container}>
    
    {/* Top Header */}
    <View style={[globalStyles.topContainer, globalStyles.paddingHorizontal,{ paddingTop: insets.top -40 }]}>
      <Text style={[globalStyles.subheadingstyles, globalStyles.textMargins]}>
        Add a meal name, tags, experience, and an image.
      </Text>
      {/* Recipe Name --> it will pass the parameters */}
      <Text style={globalStyles.h3}>Meal Name</Text>
      <TextInput
        placeholder="Enter meal name"
        style={[globalStyles.input, { marginTop: 10 }]}
        value={recipeName}
        onChangeText={setRecipeName}
      />

      {/* Recipe Steps 
      <Text style={globalStyles.h3}>Recipe</Text>
      <TextInput
        style={[globalStyles.input, { height: 120, textAlignVertical: "top" }]}
        multiline
        placeholder="Step 1..."
        value={recipe}
        onChangeText={setRecipe}
      /> */}


    </View>

    <ScrollView style={globalStyles.paddingHorizontal}>
     
      {/* Experience */}
      <Text style={globalStyles.h3}>My Experience</Text>
      <TextInput
        style={[globalStyles.input, { height: 120, textAlignVertical: "top" }]}
        multiline
        placeholder="This recipe was delicious because..."
        value={experience}
        onChangeText={setExperience}
      />
      {/* Image */}
      {photo?.uri && (
        <Image
          style={styles.image}
          source={{ uri: photo.uri }}
        />
      )}

      {/* Errors */}
      {error ? (
        <Text style={{ color: "red", marginVertical: 10 }}>{error}</Text>
      ) : null}

      {/* Bottom Buttons */}
      <View style={{ marginVertical: 30 }}>
        {/* Button to upload meal image -- image hidden until the user uploads it */}
        <TouchableOpacity
          style={[globalStyles.secondaryButton, { marginBottom: 10 }]}
          onPress={() =>
            navigation.navigate("CameraScreen", { previousScreen: "Log Meal" })
          }
        >
          <Text style={globalStyles.secondaryButtonText}>Upload Image</Text>
        </TouchableOpacity>
        {/* Upload button --> redirect user to the logged meal section in profile */}
        <TouchableOpacity
          style={globalStyles.primaryButton}
          onPress={uploadMeal}
        >
          <Text style={globalStyles.primaryButtonText}>Upload My Meal</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  </View>
);
}

const styles = StyleSheet.create({
  // image spacing and style
  image: {
    flex: 1,
    width: '100%',
    height: 150,
    marginVertical: globalStyles.sectionValues.sectionMargin,
    resizeMode: 'contain',
  },

  // error text
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});
