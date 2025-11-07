import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";

import rootStyles from '../utils/rootStyles';

export default function ProfileScreen({navigation}) {
  const [optionBarType, setOptionBarType] = useState('My Meals');
  const [meals, setMeals] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [favourites, setFavourites] = useState([]);
  
  return (
    <View style={styles.mainView}>
      <View style={styles.profileSection}>
        <View style={styles.profileCircle}>
          <Text style={styles.profileInitials}>__</Text>
        </View>

        <View>
          <Text style={styles.header}>Name</Text>

          <View style={styles.profileSpecs}>
            <Text><Text style={styles.profileStatsValues}>{meals.length}</Text> Meals</Text>
            <Text>•</Text>
            <Text><Text style={styles.profileStatsValues}>{recipes.length}</Text> Recipes</Text>
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
              optionBarType === 'My Meals' ? styles.optionButtonTextActive : styles.optionButtonText
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
              optionBarType === 'My Recipes' ? styles.optionButtonTextActive : styles.optionButtonText
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
              optionBarType === 'Favourites' ? styles.optionButtonTextActive : styles.optionButtonText
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
                    <Image
                      style={styles.mealImage}
                      source={require('../../assets/adaptive-icon.png')}
                    />

                    <View>
                      <View style={styles.mealHeader}>
                        <Text style={styles.mealHeaderText}>{item.name}</Text>
                        <Text style={styles.mealHeaderText}>-</Text>
                        <Text style={styles.mealHeaderText}>{item.date}</Text>
                      </View>
                      <Text style={styles.mealHeaderText}>Recipe</Text>
                      <Text style={styles.mealDescription}>{item.description}</Text>
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
                renderItem={({item, index}) => (
                  <View style={styles.recipe}>
                    <Image
                      style={styles.recipeImage}
                      source={require('../../assets/adaptive-icon.png')}
                    />

                    <View>
                      <Text style={styles.recipeHeaderText}>{item.name}</Text>
                      <Text style={styles.recipeDescription}>{item.description}</Text>
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
                      source={require('../../assets/adaptive-icon.png')}
                    />

                    <View>
                      <Text style={styles.recipeHeaderText}>{item.name}</Text>
                      <Text style={styles.recipeDescription}>{item.description}</Text>
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
        style={styles.logMealButton}
        onPress={() => navigation.navigate('Log Meal')}
      >
        <Image
          style={styles.logMealImage}
          source={require('../../assets/adaptive-icon.png')}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create ({
  mainView: {
    flex: 1,
    backgroundColor: rootStyles.colors.background,
  },
  header: {
    fontSize: rootStyles.headerText.fontSize*1.5,
    fontWeight: rootStyles.headerText.fontWeight,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: rootStyles.section.margin,
    marginVertical: rootStyles.section.margin*2,

  },
  profileCircle: {
    width: 75,
    height: 75,
    borderWidth: rootStyles.section.borderWidth,
    borderColor: rootStyles.colors.text,
    borderRadius: 50,
    backgroundColor: rootStyles.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    fontSize: 24, 
    color: rootStyles.colors.text,
    fontWeight: 'bold',
  },
  profileSpecs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginTop: rootStyles.section.margin,
  },
  profileStatsValues: {
    fontWeight: rootStyles.headerText.fontWeight,
  },
  optionsBar: {
    flexDirection: 'row',
    backgroundColor: rootStyles.colors.backgroundSecondary,
    borderColor: rootStyles.colors.text,
    borderWidth: rootStyles.section.borderWidth,
    borderRadius: rootStyles.button.borderRadius,
    height: 50,
    marginHorizontal: rootStyles.section.margin,
    marginBottom: rootStyles.section.margin,
  },
  optionButtonFlex: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButtonActive: {
    backgroundColor: rootStyles.colors.primary,
    borderRadius: rootStyles.button.borderRadius,
    justifyContent: 'center',
    borderWidth: rootStyles.section.borderWidth,
    borderColor: rootStyles.colors.text,
    marginVertical: -rootStyles.section.borderWidth,
    marginHorizontal: -1,
    zIndex: 2,
  },
  optionButtonText: {
    color: rootStyles.colors.text,
  },
  optionButtonTextActive: {
    fontWeight: 'bold',
  },
  optionContent: {
    flex: 1,
    padding: rootStyles.section.padding,
  },
  emptyContent: {
    textAlign: 'center',
    fontSize: rootStyles.headerText.fontSize,
    fontWeight: rootStyles.headerText.fontWeight,
  },
  meal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: rootStyles.colors.backgroundSecondary,
    borderRadius: rootStyles.button.borderRadius,
    borderWidth: rootStyles.section.borderWidth,
    borderColor: rootStyles.colors.text,
    padding: rootStyles.section.padding,
    margin: rootStyles.section.margin/2,
  },
  mealImage: {
    width: '40%',
    height: '100%',
    borderRadius: 10,
    marginRight: 10,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  mealHeaderText: {
    fontSize: rootStyles.headerText.fontSize,
    fontWeight: rootStyles.headerText.fontWeight,
  },
  mealDescription: {
    fontSize: rootStyles.bodyText.fontSize,
    width: 175,
  },
  recipe: {
    alignItems: 'center',
    backgroundColor: rootStyles.colors.backgroundSecondary,
    borderRadius: rootStyles.button.borderRadius,
    borderWidth: rootStyles.section.borderWidth,
    borderColor: rootStyles.colors.text,
    padding: rootStyles.section.padding,
    margin: rootStyles.section.margin/2,
  },
  recipeImage: {
    width: '100%',
    height: '30%',
    borderRadius: 10,
    marginRight: 10,
  },
  recipeHeaderText: {
    fontSize: rootStyles.headerText.fontSize,
    fontWeight: rootStyles.headerText.fontWeight,
  },
  recipeDescription: {
    fontSize: rootStyles.bodyText.fontSize,
  },
  logMealButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: rootStyles.colors.primary,
    borderRadius: rootStyles.button.borderRadius,
    borderWidth: rootStyles.section.borderWidth,
    borderColor: rootStyles.colors.text,
    margin: rootStyles.section.margin,
    padding: rootStyles.section.padding,
  },
  logMealImage: {
    width: 40,
    height: 40,
  },
});