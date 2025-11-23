import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { useFocusEffect } from '@react-navigation/native';

import globalStyles from '../utils/globalStyles';
import { getMeals, removeMeal } from '../utils/storage';
import { getRecipes, removeRecipe, getFavourites, toggleFavourite } from '../utils/db';


export default function ProfileScreen({navigation}) {
  const [optionBarType, setOptionBarType] = useState('My Meals');
  const [meals, setMeals] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [favourites, setFavourites] = useState([]);

  const loadData = async () => {
    try {
      const [loadedMeals, loadedRecipes, loadedFavourites] = await Promise.all([
        getMeals(),
        getRecipes(),
        getFavourites()
      ]);
      
      setMeals(loadedMeals || []);
      setRecipes(loadedRecipes || []);
      setFavourites(loadedFavourites || []);
    } catch (e) {
      console.error('Error loading data:', e);
      setMeals([]);
      setRecipes([]);
      setFavourites([]);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const deleteMeal = async (item) => {
    try {
      await removeMeal(item.name);
      setMeals(prev => prev.filter(meal => meal.name !== item.name));
    } catch (e) {
      console.error("Error deleting meal:", e);
    }
  };

  const deleteRecipe = async (item) => {
    try {
      await removeRecipe(item.id); // removes from DB
      setRecipes(prev => prev.filter(recipe => recipe.id !== item.id));
      setFavourites(prev => prev.filter(fav => fav.id !== item.id));
      // HomeScreen will sync via useFocusEffect
    } catch (e) {
      console.error("Error deleting recipe:", e);
    }
  };

  const toggleFavouriteRecipe = async (item) => {
    try {
      const newValue = await toggleFavourite(item.id, item.is_favourite);
      // Update recipes list
      setRecipes(prev =>
        prev.map(recipe =>
          recipe.id === item.id ? { ...recipe, is_favourite: newValue } : recipe
        )
      );
      // Update favourites list
      setFavourites(prev =>
        newValue === 1
          ? [...prev, { ...item, is_favourite: 1 }]
          : prev.filter(fav => fav.id !== item.id)
      );
    } catch (e) {
      console.error("Error toggling favourite:", e);
    }
  };
  
  return (
    <View style={globalStyles.mainView}>
      <View style={styles.profileSection}>
        <View style={styles.profileCircle}>
          <Text style={styles.profileInitials}>__</Text>
        </View>

        <View>
          <Text style={globalStyles.headerText}>Name</Text>

          <View style={styles.profileSpecs}>
            <Text><Text style={globalStyles.headerText.fontWeight}>{meals.length}</Text> Meals</Text>
            <Text>•</Text>
            <Text><Text style={globalStyles.headerText.fontWeight}>{recipes.length}</Text> Recipes</Text>
          </View>
        </View>
      </View>

      <View style={styles.optionsBar}>
        <TouchableOpacity
          style={[
            styles.optionButtonFlex,
            optionBarType === 'My Meals' ? styles.optionButtonActive : null
          ]}
          onPress={() => setOptionBarType('My Meals')}
        >
          <Text
            style={
              optionBarType === 'My Meals' ? globalStyles.tagText : { color: globalStyles.colors.text }
            }
          >My Meals</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButtonFlex,
            optionBarType === 'My Recipes' ? styles.optionButtonActive : null
          ]}
          onPress={() => setOptionBarType('My Recipes')}
        >
          <Text
            style={
              optionBarType === 'My Recipes' ? globalStyles.tagText : { color: globalStyles.colors.text }
            }
          >My Recipes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButtonFlex,
            optionBarType === 'Favourites' ? styles.optionButtonActive : null
          ]}
          onPress={() => setOptionBarType('Favourites')}
        >
          <Text
            style={
              optionBarType === 'Favourites' ? globalStyles.tagText : { color: globalStyles.colors.text }
            }
          >Favourites</Text>
        </TouchableOpacity>
      </View>

      {(() => {
        switch (optionBarType) {
          case 'My Meals':
            return (
              <FlatList
                style={styles.optionContent}
                data={meals}
                ListEmptyComponent={
                  <Text style={styles.emptyContent}>No Meals</Text>
                }
                renderItem={({item, index}) => (
                  <View style={styles.meal}>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteMeal(item)}
                    >
                      <Text style={globalStyles.headerText}>✕</Text>
                    </TouchableOpacity>

                    <Image
                      style={styles.mealImage}
                      source={
                        item.photo
                          ? { uri: item.photo }
                          : require('../../assets/adaptive-icon.png')
                      }
                    />

                    <View style={styles.mealTextContent}>
                      <View style={styles.mealHeader}>
                        <Text style={globalStyles.headerText2}>{item.name}</Text>
                        <Text style={globalStyles.headerText2}>{item.date}</Text>
                      </View>
                      <Text style={[globalStyles.headerText2, styles.sectionTitle]}>Recipe</Text>
                      <Text style={styles.mealDescription} numberOfLines={2}>{item.recipe}</Text>
                      <Text style={[globalStyles.headerText2, styles.sectionTitle]}>Experience</Text>
                      <Text style={styles.mealDescription} numberOfLines={2}>{item.experience}</Text>
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
                ListEmptyComponent={
                  <Text style={styles.emptyContent}>No Recipes</Text>
                }
                renderItem={({ item }) => (
                  <View style={styles.recipe}>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteRecipe(item)}
                    >
                      <Text style={globalStyles.headerText}>✕</Text>
                    </TouchableOpacity>

                    <Image
                      style={styles.recipeImage}
                      source={
                        item.image_uri
                          ? { uri: item.image_uri }
                          : require('../../assets/adaptive-icon.png')
                      }
                    />

                    <View style={styles.recipeContent}>
                      <View>
                        <Text style={globalStyles.headerText2}>{item.name}</Text>
                        <View style={styles.recipeIngredientsSection}>
                          <Text style={globalStyles.bodyText}>{item.ingredients}</Text>
                        </View>
                        <Text style={globalStyles.bodyText}>{item.instructions}</Text>
                      </View>

                      <View>
                        <TouchableOpacity
                          style={styles.favouriteButton}
                          onPress={() => toggleFavouriteRecipe(item)}
                        >
                          <Text style={globalStyles.headerText}>
                            {item.is_favourite === 1 ? '♥︎' : '♡'}
                          </Text>
                        </TouchableOpacity>
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
                ListEmptyComponent={
                  <Text style={styles.emptyContent}>No Favourites</Text>
                }
                renderItem={({item, index}) => (
                  <View style={styles.recipe}>
                  <Image
                    style={styles.recipeImage}
                    source={
                      item.image_uri
                        ? { uri: item.image_uri }
                        : require('../../assets/adaptive-icon.png')
                    }
                  />

                    <View>
                      <Text style={globalStyles.headerText2}>{item.name}</Text>
                      <View style={styles.recipeIngredientsSection}>
                        <Text style={globalStyles.bodyText}>{item.ingredients}</Text>
                      </View>
                      <Text style={globalStyles.bodyText}>{item.instructions}</Text>
                    </View>
                  </View>
                )}
              />
            );
          default:
            return null;
        }
      })()}

      <TouchableOpacity
        style={globalStyles.logMealButton}
        onPress={() => navigation.navigate('Log Meal', {photo: '../../assets/adaptive-icon.png'})}
      >
        <Image
          style={globalStyles.logMealImage}
          source={require('../../assets/adaptive-icon.png')}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create ({
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: globalStyles.sectionValues.sectionMargin,
    marginVertical: globalStyles.sectionValues.sectionMargin*2,
  },
  profileCircle: {
    width: 75,
    height: 75,
    borderWidth: globalStyles.sectionValues.sectionBorderWidth,
    borderColor: globalStyles.colors.text,
    borderRadius: 50,
    backgroundColor: globalStyles.colors.primary,
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
    marginTop: globalStyles.sectionValues.sectionMargin,
  },
  optionsBar: {
    flexDirection: 'row',
    backgroundColor: globalStyles.colors.backgroundSecondary,
    borderColor: globalStyles.colors.text,
    borderWidth: globalStyles.sectionValues.sectionBorderWidth,
    borderRadius: globalStyles.buttonValues.buttonBorderRadius,
    height: 50,
    marginHorizontal: globalStyles.sectionValues.sectionMargin,
    marginBottom: globalStyles.sectionValues.sectionMargin,
  },
  optionButtonFlex: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButtonActive: {
    backgroundColor: globalStyles.colors.primary,
    borderRadius: globalStyles.buttonValues.buttonBorderRadius,
    justifyContent: 'center',
    borderWidth: globalStyles.sectionValues.sectionBorderWidth,
    borderColor: globalStyles.colors.text,
    marginVertical: -globalStyles.sectionValues.sectionBorderWidth,
    marginHorizontal: -1,
    zIndex: 2,
  },
  optionContent: {
    flex: 1,
    padding: globalStyles.sectionValues.sectionPadding,
  },
  emptyContent: {
    textAlign: 'center',
    fontSize: globalStyles.headerText.fontSize,
    fontWeight: globalStyles.headerText.fontWeight,
  },
  meal: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: globalStyles.colors.backgroundSecondary,
    borderRadius: globalStyles.buttonValues.buttonBorderRadius,
    borderWidth: globalStyles.sectionValues.sectionBorderWidth,
    borderColor: globalStyles.colors.text,
    padding: globalStyles.sectionValues.sectionPadding,
    margin: globalStyles.sectionValues.sectionMargin/2,
  },
  mealImage: {
    width: '40%',
    height: 150,
    borderRadius: 10,
    marginRight: 10,
  },
  mealTextContent: {
    flex: 1,
    marginLeft: 10,
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
    backgroundColor: globalStyles.colors.backgroundSecondary,
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
});
