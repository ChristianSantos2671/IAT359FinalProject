import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";

import globalStyles from '../utils/globalStyles';

export default function ProfileScreen({navigation}) {
  const [optionBarType, setOptionBarType] = useState('My Meals');
  const [meals, setMeals] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [favourites, setFavourites] = useState([]);
  
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
                    <Image
                      style={styles.mealImage}
                      source={require('../../assets/adaptive-icon.png')}
                    />

                    <View>
                      <View style={globalStyles.headerText2}>
                        <Text style={globalStyles.headerText2}>{item.name}</Text>
                        <Text style={globalStyles.headerText2}>-</Text>
                        <Text style={globalStyles.headerText2}>{item.date}</Text>
                      </View>
                      <Text style={globalStyles.headerText2}>Recipe</Text>
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
                      <Text style={globalStyles.headerText2}>{item.name}</Text>
                      <Text style={globalStyles.bodyText}>{item.description}</Text>
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
                      <Text style={globalStyles.headerText2}>{item.name}</Text>
                      <Text style={globalStyles.bodyText}>{item.description}</Text>
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: globalStyles.section.margin,
    marginVertical: globalStyles.section.margin*2,
  },
  profileCircle: {
    width: 75,
    height: 75,
    borderWidth: globalStyles.section.borderWidth,
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
    marginTop: globalStyles.section.margin,
  },
  optionsBar: {
    flexDirection: 'row',
    backgroundColor: globalStyles.colors.backgroundSecondary,
    borderColor: globalStyles.colors.text,
    borderWidth: globalStyles.section.borderWidth,
    borderRadius: globalStyles.button.borderRadius,
    height: 50,
    marginHorizontal: globalStyles.section.margin,
    marginBottom: globalStyles.section.margin,
  },
  optionButtonFlex: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButtonActive: {
    backgroundColor: globalStyles.colors.primary,
    borderRadius: globalStyles.button.borderRadius,
    justifyContent: 'center',
    borderWidth: globalStyles.section.borderWidth,
    borderColor: globalStyles.colors.text,
    marginVertical: -globalStyles.section.borderWidth,
    marginHorizontal: -1,
    zIndex: 2,
  },
  optionContent: {
    flex: 1,
    padding: globalStyles.section.padding,
  },
  emptyContent: {
    textAlign: 'center',
    fontSize: globalStyles.headerText.fontSize,
    fontWeight: globalStyles.headerText.fontWeight,
  },
  meal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: globalStyles.colors.backgroundSecondary,
    borderRadius: globalStyles.button.borderRadius,
    borderWidth: globalStyles.section.borderWidth,
    borderColor: globalStyles.colors.text,
    padding: globalStyles.section.padding,
    margin: globalStyles.section.margin/2,
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
  mealDescription: {
    fontSize: globalStyles.bodyText.fontSize,
    width: 175,
  },
  recipe: {
    alignItems: 'center',
    backgroundColor: globalStyles.colors.backgroundSecondary,
    borderRadius: globalStyles.button.borderRadius,
    borderWidth: globalStyles.section.borderWidth,
    borderColor: globalStyles.colors.text,
    padding: globalStyles.section.padding,
    margin: globalStyles.section.margin/2,
  },
  recipeImage: {
    width: '100%',
    height: '30%',
    borderRadius: 10,
    marginRight: 10,
  },
  logMealButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: globalStyles.colors.primary,
    borderRadius: globalStyles.button.borderRadius,
    borderWidth: globalStyles.section.borderWidth,
    borderColor: globalStyles.colors.text,
    margin: globalStyles.section.margin,
    padding: globalStyles.section.padding,
  },
  logMealImage: {
    width: 40,
    height: 40,
  },
});