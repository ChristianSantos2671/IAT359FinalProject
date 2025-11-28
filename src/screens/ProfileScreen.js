import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { useFocusEffect } from '@react-navigation/native';

import globalStyles from '../utils/globalStyles';
import { getMeals, removeMeal } from '../utils/storage';
import { getRecipes, removeRecipe, toggleFavourite } from '../utils/db';
import { firebase_auth, db } from "../utils/firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";


export default function ProfileScreen({navigation, route}) {
  const [optionBarType, setOptionBarType] = useState('My Logged Meals');
  const [meals, setMeals] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const insets = useSafeAreaInsets();

  // load meals & recipes from DB and separate favourites
  const loadData = async () => {
    try {
      const allRecipes = await getRecipes();

      // Separate favourites and non-favourites
      const favs = allRecipes.filter(r => r.is_favourite === 1);
      const nonFavs = allRecipes.filter(r => r.is_favourite !== 1);

      setRecipes(nonFavs); // only non-favourites
      setFavourites(favs); // only favourites

      const loadedMeals = await getMeals();
      setMeals(loadedMeals || []);
    } catch (e) {
      console.error('Error loading data:', e);
      setMeals([]);
      setRecipes([]);
      setFavourites([]);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (route?.params?.activeTab) {
        setOptionBarType(route.params.activeTab);
      }

      if (route?.params?.firstname) {
        setFirstName(route.params.firstname || "N/A");
        setLastName(route.params.lastname || "N/A");
      } else {
        const loadUser = async () => {
          const user = firebase_auth.currentUser;
          if (!user) return;

          const snap = await getDoc(doc(db, "Users", user.uid));
          if (snap.exists()) {
            const data = snap.data();
            setFirstName(data.firstName || "N/A");
            setLastName(data.lastName || "N/A");
          }
        };
        loadUser();
      }

      loadData();
    }, [route?.params])
  );

  // delete meal from storage & state
  const deleteMeal = async (item) => {
    try {
      await removeMeal(item.timestamp);
      setMeals(prev => prev.filter(meal => meal.timestamp !== item.timestamp));
    } catch (e) {
      console.error("Error deleting meal:", e);
    }
  };

  // delete recipe from DB & remove from both lists
  const deleteRecipe = async (item) => {
    try {
      await removeRecipe(item.id);
      setRecipes(prev => prev.filter(recipe => recipe.id !== item.id));
      setFavourites(prev => prev.filter(fav => fav.id !== item.id));
    } catch (e) {
      console.error("Error deleting recipe:", e);
    }
  };

  // toggle favourite status and move recipe between lists
  const toggleFavouriteRecipe = async (item) => {
    try {
      if (item.is_favourite === 1) {
        // If currently a favourite → remove completely
        await removeRecipe(item.id);
        setFavourites(prev => prev.filter(fav => fav.id !== item.id));
        setRecipes(prev => prev.filter(r => r.id !== item.id));
      } else {
        // Add as favourite
        const newItem = {
          ...item,
          is_favourite: 1,
          category: item.category || "",
          area: item.area || "",
          tags: item.tags || "",
        };
        await saveRecipe(newItem);
        setFavourites(prev => [...prev, newItem]);
      }
    } catch (e) {
      console.error("Error toggling favourite:", e);
    }
  };

  return (
    <View style={globalStyles.container}>
      {/* Profile section */}
      <View style={[globalStyles.topContainer, styles.profileSection, globalStyles.paddingHorizontal, { paddingTop: insets.top + 5 }]}>
        <View style={styles.profileCircle}>
          <Text style={styles.profileInitials}>{(firstname || "N/A")[0]}{(lastname || "A")[0]}</Text>
        </View>

        <View>
            <Text style={[globalStyles.h1, {alignSelf: 'center'}]}>{(firstname || "N/A")} {(lastname || "A")}</Text>

          <View style={styles.profileSpecs}>
            <Text><Text style={globalStyles.headerText.fontWeight}>{meals.length}</Text> Meals</Text>
            <Text>•</Text>
            <Text><Text style={globalStyles.headerText.fontWeight}>{recipes.length}</Text> Recipes</Text>
          </View>
        </View>

        {/* Option bar */}
        <View style={globalStyles.optionsBar}>
          <TouchableOpacity
            style={[globalStyles.optionButtonFlex, optionBarType === 'My Logged Meals' ? globalStyles.optionButtonActive : null]}
            onPress={() => setOptionBarType('My Logged Meals')}
          >
            <Text style={optionBarType === 'My Logged Meals' ? globalStyles.optionButtonTextActive : globalStyles.optionButtonText}>My Logged Meals</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[globalStyles.optionButtonFlex, optionBarType === 'My Recipes' ? globalStyles.optionButtonActive : null]}
            onPress={() => setOptionBarType('My Recipes')}
          >
            <Text style={optionBarType === 'My Recipes' ? globalStyles.optionButtonTextActive : globalStyles.optionButtonText}>My Recipes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[globalStyles.optionButtonFlex, optionBarType === 'Favourites' ? globalStyles.optionButtonActive : null]}
            onPress={() => setOptionBarType('Favourites')}
          >
            <Text style={optionBarType === 'Favourites' ? globalStyles.optionButtonTextActive : globalStyles.optionButtonText}>Favourites</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Render content based on selected tab */}
      {(() => {
        switch (optionBarType) {
          case 'My Logged Meals':
            return (
              <FlatList
                style={styles.optionContent}
                data={meals}
                ListEmptyComponent={<Text style={styles.emptyContent}>No Logged Meals</Text>}
                renderItem={({item}) => (
                  <View style={styles.meal}>
                    <TouchableOpacity
                      style={[globalStyles.deleteButton, globalStyles.deletePosition]}
                      onPress={() => deleteMeal(item)}
                    >
                      <Text style={[globalStyles.h4, globalStyles.favouriteActive]}>✕</Text>
                    </TouchableOpacity>

                    <Image style={styles.mealImage} source={item.photo ? { uri: item.photo } : require('../../assets/adaptive-icon.png')} />

                    <View style={styles.mealTextContent}>
                      <View style={styles.mealHeader}>
                        <Text style={globalStyles.h3}>{item.name}</Text>
                        <Text style={globalStyles.h3}>{item.date}</Text>
                      </View>
                      {/*<Text style={[globalStyles.h4, styles.sectionTitle]}>Recipe</Text>
                      <Text style={styles.mealDescription} numberOfLines={2}>{item.recipe}</Text> */}
                      <Text style={[globalStyles.h4, styles.sectionTitle]}>Experience</Text>
                      <Text style={globalStyles.bodyText} numberOfLines={2}>{item.experience}</Text>
                    </View>
                  </View>
                )}
              />
            );
          case 'My Recipes':
            return (
              <FlatList
                style={styles.optionContent}
                data={recipes}
                ListEmptyComponent={<Text style={styles.emptyContent}>No Recipes</Text>}
                renderItem={({ item }) => (
                  <View style={styles.recipe}>
                    <TouchableOpacity
                      style={[globalStyles.deleteButton, globalStyles.deletePosition]}
                      onPress={() => deleteRecipe(item)}
                    >
                      <Text style={[globalStyles.h4, globalStyles.favouriteActive]}>✕</Text>
                    </TouchableOpacity>

                    <Image style={styles.recipeImage} source={item.image_uri ? { uri: item.image_uri } : require('../../assets/recipe_default.png')} />

                    <View style={styles.recipeContent}>
                      <View>
                        <Text style={globalStyles.h3}>{item.name}</Text>
                        <View style={styles.recipeIngredientsSection}>

                          <Text style={globalStyles.bodyText}>{item.ingredients}</Text>
                        </View>
                        <Text style={styles.bodyText}>{item.instructions}</Text>
                      </View>
                    </View>
                  </View>
                )}
              />
            );
          case 'Favourites':
            return (
              <FlatList
                style={styles.optionContent}
                data={favourites}
                ListEmptyComponent={<Text style={styles.emptyContent}>No Favourites</Text>}
               renderItem={({ item }) => (
                <TouchableOpacity
                  style={[globalStyles.itemContainer, styles.favouriteSpacing]}
                  onPress={() => navigation.navigate("Saved Recipe Details", { recipe: item })}
                >
                  <Image 
                    source={{ uri: item.image_uri }}
                    style={globalStyles.thumbnail}
                  />

                  <View style={globalStyles.mealCardTextContainer}>
                    <View style={globalStyles.favouriteContainer}>
                      <Text style={globalStyles.h3}>{item.name}</Text>

                      <TouchableOpacity
                        style={globalStyles.favouriteButton}
                        onPress={() => toggleFavouriteRecipe(item)}
                      >
                        <Text style={[globalStyles.h3, Number(item.is_favourite) === 1 && globalStyles.favouriteActive]}>
                          {Number(item.is_favourite) === 1 ? '♥︎' : '♡'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={[globalStyles.tagContainer, {maxWidth: '80%'}]}>
                      <Text style={[globalStyles.tag, globalStyles.categoryTag]}> {item.category} </Text>
                      <Text style={[globalStyles.tag, globalStyles.areaTag]}> {item.area} </Text>
                      {/*splitting the tags string into individual tags */}
                      {item.tags && item.tags.split(',').slice(0,3).map((tag, index) => (
                        <Text key={index} style={[globalStyles.tag, globalStyles.otherTags]}>
                          {tag.trim()}
                        </Text>
                      ))}
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
            );
          default:
            return null;
        }
      })()}

      {/* Log meal button */}
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

const styles = StyleSheet.create ({
  profileSection: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileCircle: {
    width: 75,
    height: 75,
    borderWidth: globalStyles.sectionValues.sectionBorderWidth,
    borderColor: globalStyles.colors.border,
    borderRadius: 50,
    backgroundColor: globalStyles.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    fontSize: 24, 
    color: globalStyles.colors.text,
    fontWeight: 'bold',
  },
  profileSpecs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginVertical: globalStyles.sectionValues.sectionMargin,
  },
  
  optionContent: {
    flex: 1,
    padding: globalStyles.sectionValues.sectionPadding,
  },
  
  emptyContent: {
    textAlign: 'center',
  },
  
  meal: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderRadius: globalStyles.sectionValues.sectionRadius,
    borderWidth: globalStyles.sectionValues.sectionBorderWidth,
    borderColor: globalStyles.colors.border,
    padding: globalStyles.sectionValues.sectionPadding,
    marginBottom: globalStyles.sectionValues.sectionMargin,
    gap: 6,
  },
  
  mealImage: {
    width: '40%',
    height: 150,
    borderRadius:8,
  },
  mealTextContent: {
    flex: 1,
    marginLeft: 4,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  mealDescription: {
    fontSize: globalStyles.bodyText.fontSize,
    color: globalStyles.colors.text,
    marginBottom: 8,
  },
  sectionTitle: {
    marginTop: 4,
    marginBottom: 2,
    color: globalStyles.colors.primary,
  },
  recipe: {
    alignItems: 'flex-start',
    backgroundColor: "white",
    borderRadius: globalStyles.buttonValues.buttonBorderRadius,
    borderWidth: globalStyles.sectionValues.sectionBorderWidth,
    borderColor: globalStyles.colors.text,
    padding: globalStyles.sectionValues.sectionPadding,
    margin: globalStyles.sectionValues.sectionMargin/2,
  },
  recipeImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  recipeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  recipeIngredientsSection: {
    marginVertical: globalStyles.sectionValues.sectionMargin/2,
  },
  favouriteButton: {
    position: 'absolute',
    right: '100%',
    top: -65,
    borderRadius: globalStyles.buttonValues.buttonBorderRadius,
    borderWidth: globalStyles.sectionValues.sectionBorderWidth,
    borderColor: globalStyles.colors.text,
    backgroundColor: globalStyles.colors.primary,
    padding: globalStyles.buttonValues.buttonPadding,
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    margin: globalStyles.sectionValues.sectionMargin,
    zIndex: 1,
  },

  favouriteSpacing:{
    marginTop: 0, 
    marginBottom: 10
  }
});
