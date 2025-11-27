import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import globalStyles from '../utils/globalStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Random time generator
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default function FaveRecipeDetailsScreen({ navigation, route }) {
  const { recipe } = route.params; // <<---- DB RECIPE HERE
  const insets = useSafeAreaInsets();
  const [optionBarType, setOptionBarType] = useState("Details");

  // Random values to match HomeScreen style
  const randomServings = getRandomInt(1, 6);
  const randomPrepTime = getRandomInt(10, 30);
  const randomCookTime = getRandomInt(15, 60);

  // Build ingredients list (DB stores "ingredient1, ingredient2, ingredient3")
  const ingredientsList = recipe.ingredients
    ? recipe.ingredients.split(",").map((i, index) => `${index + 1}. ${i.trim()}`)
    : [];

  return (
    <View style={globalStyles.container}>
      <ScrollView>

        {/* HEADER SECTION */}
        <View style={[globalStyles.paddingHorizontal, globalStyles.topContainer]}>

          <Image
            source={{ uri: recipe.image_uri }}
            style={styles.image}
          />

          <Text style={[globalStyles.h2, globalStyles.textMargins]}>
            {recipe.name}
          </Text>

          <Text style={[globalStyles.subheadingstyles, globalStyles.textMargins]}>
            A delightful dish that combines flavors and textures to create a memorable culinary experience.
          </Text>

          {/* TAGS */}
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

          {/* OPTION BAR */}
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

        {/* CONTENT SECTION (BASED ON TAB) */}
        {(() => {
          switch (optionBarType) {
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

      {/* BOTTOM BUTTONS */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={globalStyles.secondaryButton}
          onPress={() => navigation.navigate("Grocery List", { ingredients: ingredientsList })}
        >
          <Text style={globalStyles.secondaryButtonText}>Shop Ingredients</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={globalStyles.primaryButton}
          onPress={() => navigation.navigate("Log Meal", { photo: recipe.image_uri })}
        >
          <Text style={globalStyles.primaryButtonText}>Log Meal</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
    paddingHorizontal: 16,
  },
});
