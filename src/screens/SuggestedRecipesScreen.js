import React, { useState, useEffect } from "react";
import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system/legacy";
import { generateRecipesFromImage } from "../utils/geminiService";
import globalStyles from "../utils/globalStyles";

export default function SuggestedRecipesScreen({ route, navigation }) {
  const { photo } = route.params;
  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(true);
  const [suggestedRecipes, setSuggestedRecipes] = useState([]);
  const [error, setError] = useState(null);

  // This url is where to access TheMealDB API.
  const API_ENDPOINT = (query) =>
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;

  // This will run once for initialization processing the image received by this page.
  useEffect(() => {
    const processImage = async () => {
      try {
        console.log("Photo received:", photo.uri);

        // Get the photo that was passed in from the route.params. It is a base 64 encoded string of the image.
        const base64Image = await FileSystem.readAsStringAsync(photo.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Call the Gemini API to get the list of recipes from the image.
        let recipesRaw = await generateRecipesFromImage(base64Image, "image/jpeg");
        if (!recipesRaw) {
          throw new Error("No response from Gemini API");
        }

        // Clean up the code fences from the Gemini response.
        recipesRaw = recipesRaw
          .replace(/^```json\s*/i, "")
          .replace(/```$/i, "")
          .trim();

        let recipes;
        try {
          recipes = JSON.parse(recipesRaw);
        } catch (e) {
          console.error("JSON parse error:", e, "Raw:", recipesRaw);
          throw new Error("Failed to parse recipes from AI response");
        }

        if (recipes.length === 1 && recipes[0].startsWith("Error")) {
          setError(recipes[0]);
          setIsLoading(false);
          return;
        }

        // Create an array of promises by mapping over each recipe name.
        const fetchPromises = recipes.map(async (name) => {
          const response = await fetch(API_ENDPOINT(name));
          const json = await response.json();
          return json.meals || [];
        });

        // Wait for all fetch requests to complete in parallel.
        const mealsArrays = await Promise.all(fetchPromises);
        // Flatten the resulting array of arrays into a single list of meals.
        const allMeals = mealsArrays.flat();

        setSuggestedRecipes(allMeals);
      } catch (e) {
        console.error("Error processing image:", e);
        setError(e.message);
        Alert.alert("Error", e.message);
      } finally {
        setIsLoading(false);
      }
    };

    processImage();
  }, []);

  // Shows a loading spinning incidator.
  if (isLoading) {
    return (
      <View style={globalStyles.loader}>
        <ActivityIndicator size="large" color="green" />
        <Text>Analyzing image and finding recipes...</Text>
      </View>
    );
  }

  // Display the error is there is one.
  if (error) {
    return (
      <View style={globalStyles.loader}>
        <Text style={{ color: "red", fontSize: 16, textAlign: "center" }}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CameraScreen')}>
          <Text style={globalStyles.headerText2}>Retake</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={globalStyles.mainView}>
      <Image style={styles.image} source={{ uri: photo.uri }} />

      <FlatList
        data={suggestedRecipes}
        style={globalStyles.paddingHorizontal}
        keyExtractor={(item) => item.idMeal?.toString()}
        ListEmptyComponent={() => (
          <Text style={styles.noRecipes}>No recipes found from the image.</Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.itemContainer, globalStyles.dropshadow]}
            // 
            onPress={() => navigation.navigate("Recipe Details", { meal: item })}
          >
            <Image source={{ uri: item.strMealThumb }} style={styles.thumbnail} />

            <View style={styles.mealCardTextContainer}>
              <Text style={globalStyles.h3}>{item.strMeal}</Text>
              <View style={globalStyles.tagContainer}>
                <Text style={[globalStyles.tag, globalStyles.categoryTag]}>{item.strCategory}</Text>
                <Text style={[globalStyles.tag, globalStyles.areaTag]}>{item.strArea}</Text>
                {item.strTags &&
                  item.strTags.split(",").slice(0, 3).map((tag, index) => (
                    <Text key={index} style={[globalStyles.tag, globalStyles.otherTags]}>
                      {tag.trim()}
                    </Text>
                  ))}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <View>
        <TouchableOpacity
          style={[styles.button, { marginBottom: insets.bottom }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={globalStyles.headerText2}>Retake</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  noRecipes: {
    textAlign: "center",
    marginTop: 20,
  },
  itemContainer: {
    alignItems: "flex-start",
    flexDirection: "row",
    marginTop: 10,
    gap: 15,
    backgroundColor: globalStyles.colors.backgroundSecondary,
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: globalStyles.colors.primary,
  },
  mealCardTextContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  button: {
    backgroundColor: globalStyles.colors.primary,
    borderWidth: globalStyles.buttonValues.buttonBorderWidth,
    borderRadius: globalStyles.buttonValues.buttonBorderRadius,
    paddingVertical: globalStyles.buttonValues.buttonPadding,
    paddingHorizontal: 100,
    marginHorizontal: globalStyles.sectionValues.sectionMargin, 
    alignItems: 'center',
    justifyContent: 'center',
  },
});
