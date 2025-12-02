import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import globalStyles from '../utils/globalStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Function to generate a random integer between min and max (inclusive)
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default function FaveRecipeDetailsScreen({ navigation, route }) {
  const { recipe } = route.params; // sending db recipe parameters
  const insets = useSafeAreaInsets();
  const [optionBarType, setOptionBarType] = useState("Details");

  // Random values for details section
  const randomServings = getRandomInt(1, 6);
  const randomPrepTime = getRandomInt(10, 30);
  const randomCookTime = getRandomInt(15, 60);

  // Build ingredients list from DB
  const ingredientsList = recipe.ingredients
    ? recipe.ingredients.split(",").map((i, index) => `${index + 1}. ${i.trim()}`)
    : [];

  return (
    <View style={globalStyles.container}>
      <ScrollView>

      {/* top container for image + recipe details like tags, name etc */}
        <View style={[globalStyles.paddingHorizontal, globalStyles.topContainer]}>

        {/*recipe image*/}

          <Image
            source={{ uri: recipe.image_uri }}
            style={styles.image}
          />
        {/* recipe name */}

          <Text style={[globalStyles.h2, globalStyles.textMargins]}>
            {recipe.name}
          </Text>

          {/* tags */}
          <View style={globalStyles.tagContainer}>
            {recipe.category ? (
              <Text style={[globalStyles.tag, globalStyles.categoryTag]}>
                {recipe.category}
              </Text>
            ) : null}

            {recipe.area ? (
              <Text style={[globalStyles.tag, globalStyles.areaTag]}>
                {recipe.area}
              </Text>
            ) : null}

            {recipe.tags &&
              recipe.tags.split(",").slice(0, 3).map((tag, index) => (
                <Text key={index} style={[globalStyles.tag, globalStyles.otherTags]}>
                  {tag.trim()}
                </Text>
              ))
            }
          </View>

          {/* Option bar for Details, Ingredients, Instructions */}
          <View style={globalStyles.optionsBar}>
            <TouchableOpacity
              style={[globalStyles.optionButtonFlex, optionBarType === "Details" ? globalStyles.optionButtonActive : null]}
              onPress={() => setOptionBarType("Details")}
            >
              <Text style={optionBarType === "Details" ? globalStyles.optionButtonTextActive : globalStyles.optionButtonText}>
                Details
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[globalStyles.optionButtonFlex, optionBarType === "Ingredients" ? globalStyles.optionButtonActive : null]}
              onPress={() => setOptionBarType("Ingredients")}
            >
              <Text style={optionBarType === "Ingredients" ? globalStyles.optionButtonTextActive : globalStyles.optionButtonText}>
                Ingredients
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[globalStyles.optionButtonFlex, optionBarType === "Instructions" ? globalStyles.optionButtonActive : null]}
              onPress={() => setOptionBarType("Instructions")}
            >
              <Text style={optionBarType === "Instructions" ? globalStyles.optionButtonTextActive : globalStyles.optionButtonText}>
                Instructions
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CONTENT SECTION*/}
        {(() => {
          switch (optionBarType) {
            // all the recipe details
            case "Details":
              return (
                <View>
                  <View style={[globalStyles.paddingHorizontal, globalStyles.textSection]}>
                    <Text style={globalStyles.h3}>Prep Time</Text>
                    <Text style={globalStyles.bodyText}>{randomPrepTime} minutes</Text>
                  </View>

                  <View style={[globalStyles.paddingHorizontal, globalStyles.textSection]}>
                    <Text style={globalStyles.h3}>Cook Time</Text>
                    <Text style={globalStyles.bodyText}>{randomCookTime} minutes</Text>
                  </View>

                  <View style={[globalStyles.paddingHorizontal, globalStyles.textSection]}>
                    <Text style={globalStyles.h3}>Servings</Text>
                    <Text style={globalStyles.bodyText}>{randomServings} servings</Text>
                  </View>
                </View>
              );

            case "Ingredients":
            // list of ingredients + measurements mapped into a list 

              return (
                <View style={[globalStyles.paddingHorizontal, globalStyles.textSection]}>
                  <Text style={globalStyles.h3}>Ingredients</Text>
                  {ingredientsList.map((line, i) => (
                    <Text key={i} style={globalStyles.bodyText}>
                      {line}
                    </Text>
                  ))}
                </View>
              );

            case "Instructions":
              // recipe instructions

              return (
                <View style={[globalStyles.paddingHorizontal, globalStyles.textSection]}>
                  <Text style={globalStyles.h3}>Instructions</Text>
                  <Text style={globalStyles.bodyText}>
                    {recipe.instructions}
                  </Text>
                </View>
              );

            default:
              return null;
          }
        })()}
      </ScrollView>

      {/* Bottom buttons for Grocery List and Log Meal */}
      <View style={[styles.bottomButtons, {paddingBottom: insets.bottom}]}>
        {/* Shop ingredients will pass the recipe ingredients to the Grocery list screen */}
        <TouchableOpacity
          style={globalStyles.secondaryButton}
          onPress={() => navigation.navigate("Grocery List", { ingredients: ingredientsList })}
        >
          <Text style={globalStyles.secondaryButtonText}>Shop Ingredients</Text>
        </TouchableOpacity>

        {/* Log meal button will push the meal name and redirect the user */}
        <TouchableOpacity
          style={globalStyles.primaryButton}
          onPress={() =>
            navigation.navigate("Log Meal", { 
              photo: recipe.image_uri,
              mealName: recipe.name 
            })
          }
        >
          <Text style={globalStyles.primaryButtonText}>Log Meal</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  // image styling
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  
  // spacing for the bottom buttons
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
    paddingHorizontal: 16,
    gap: 10
  },
});
