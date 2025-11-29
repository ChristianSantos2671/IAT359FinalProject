import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system/legacy";
import { generateRecipesFromImage } from "../utils/geminiService";
import globalStyles from "../utils/globalStyles";

/**
 * This screen analyzes an image (usually of a meal) using the Gemini API,
 * generates possible recipe names, and then fetches detailed data for each
 * from TheMealDB public API.
 * It shows:
 *  - A loading screen while processing the image
 *  - A list of suggested recipes once ready
 *  - An error screen with retry if something goes wrong
 */
export default function SuggestedRecipesScreen({ route, navigation }) {
  const { photo } = route.params;
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(true);
  const [suggestedRecipes, setSuggestedRecipes] = useState([]);
  const [error, setError] = useState(null);

  // TheMealDB endpoint for fetching detailed recipe info by name
  const API_ENDPOINT = (query) =>
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;

  /**
   * Reads the captured image from disk, converts it to base64,
   * sends it to the Gemini API, and fetches recipe data from TheMealDB.
   */
  useEffect(() => {
    const processImage = async () => {
      try {
        console.log("Photo received:", photo.uri);

        // Convert photo file to a base64 string for Gemini API.
        const base64Image = await FileSystem.readAsStringAsync(photo.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Send image to Gemini AI for analysis and recipe name generation.
        let recipesRaw = await generateRecipesFromImage(base64Image, "image/jpeg");
        if (!recipesRaw) throw new Error("No response from Gemini API");

        // Clean code fences or markdown syntax that Gemini might return.
        recipesRaw = recipesRaw
          .replace(/^```json\s*/i, "")
          .replace(/```$/i, "")
          .trim();

        // Parse Gemini’s JSON-formatted response.
        let recipes;
        try {
          recipes = JSON.parse(recipesRaw);
        } catch (e) {
          console.error("JSON parse error:", e, "Raw:", recipesRaw);
          throw new Error("Failed to parse recipes from AI response");
        }

        // Handle case where Gemini API explicitly returned an error.
        if (recipes.length === 1 && recipes[0].startsWith("Error")) {
          setError(recipes[0]);
          setIsLoading(false);
          return;
        }

        /**
         * Fetch detailed recipe data from TheMealDB for each recipe name Gemini suggested.
         * This creates multiple API requests and resolves them all in parallel.
         */
        const fetchPromises = recipes.map(async (name) => {
          const response = await fetch(API_ENDPOINT(name));
          const json = await response.json();
          return json.meals || []; // return an array of meals or empty array.
        });

        // Wait for all TheMealDB requests to complete, then flatten nested arrays.
        const mealsArrays = await Promise.all(fetchPromises);
        const allMeals = mealsArrays.flat();

        // Store all fetched meal objects in state.
        setSuggestedRecipes(allMeals);
      } catch (e) {
        console.error("Error processing image:", e);
        setError(e.message);
        Alert.alert("Error", e.message);
      } finally {
        // Always stop loading spinner after processing.
        setIsLoading(false);
      }
    };

    processImage();
  }, []);

  // Show loading spinner while analyzing image and fetching recipes.
  if (isLoading) {
    return (
      <View style={globalStyles.loader}>
        <ActivityIndicator size="large" color="green" />
        <Text>Analyzing image and finding recipes...</Text>
      </View>
    );
  }

  // Show error message if API call or parsing failed.
  if (error) {
    return (
      <View style={globalStyles.loader}>
        <Text style={{ color: "red", fontSize: 16, textAlign: "center" }}>{error}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("CameraScreen")}
        >
          <Text style={globalStyles.headerText2}>Retake</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={globalStyles.mainView}>
      {/* Display the analyzed image at top */}
      <Image style={styles.image} source={{ uri: photo.uri }} />

      {/* List of recipes returned by Gemini + TheMealDB */}
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
            onPress={() => navigation.navigate("Recipe Details", { meal: item })}
          >
            {/* Recipe thumbnail image */}
            <Image source={{ uri: item.strMealThumb }} style={styles.thumbnail} />

            {/* Recipe text info */}
            <View style={styles.mealCardTextContainer}>
              <Text style={globalStyles.h3}>{item.strMeal}</Text>
              <View style={globalStyles.tagContainer}>
                <Text style={[globalStyles.tag, globalStyles.categoryTag]}>
                  {item.strCategory}
                </Text>
                <Text style={[globalStyles.tag, globalStyles.areaTag]}>
                  {item.strArea}
                </Text>

                {/* Display up to 3 tags if available */}
                {item.strTags &&
                  item.strTags.split(",").slice(0, 3).map((tag, index) => (
                    <Text
                      key={index}
                      style={[globalStyles.tag, globalStyles.otherTags]}
                    >
                      {tag.trim()}
                    </Text>
                  ))}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Retake button (bottom of screen) */}
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
    alignItems: "center",
    justifyContent: "center",
  },
});
