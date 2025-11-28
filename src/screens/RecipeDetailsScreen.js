import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import globalStyles from '../utils/globalStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getFavourites, toggleFavourite } from '../utils/db';


import { get } from 'lodash';

// Function to generate a random integer between min and max (inclusive)
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};



export default function RecipeDetailsScreen({navigation, route}) {
  const { meal } = route.params; 
  const [optionBarType, setOptionBarType] = useState('Details');
  // Generate random numbers
  const randomServings = getRandomInt(1, 6);
  const randomPrepTime = getRandomInt(10, 30);
  const randomCookTime = getRandomInt(15, 60);
  const insets = useSafeAreaInsets();
  const [favourites, setFavourites] = useState([]);

  
  // making the list of ingredients + measurements
  const ingredientsList = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    // check if ingredient exists
    if (ingredient && ingredient.trim() !== '') {
      // adding measurement + ingredient as one item 
      ingredientsList.push(`${i}. ${measure ? measure : ''} ${ingredient}`.trim());
    }
  }; 

  {/* favouriting the recipes 
  const toggleFavouriteRecipe = async (item) => {
      const isAlreadyFavourite = item.is_favourite === 1;
      try {
        await toggleFavourite(item.id, !isAlreadyFavourite);
        // Update local state
        setRecipes(prev => prev.map(recipe => 
          recipe.id === item.id 
            ? { ...recipe, is_favourite: isAlreadyFavourite ? 0 : 1 }
            : recipe
        ));
        // Update favourites list
        if (isAlreadyFavourite) {
          setFavourites(prev => prev.filter(fav => fav.id !== item.id));
        } else {
          const updatedItem = { ...item, is_favourite: 1 };
          setFavourites(prev => [...prev, updatedItem]);
        }
      } catch (e) {
        console.error("Error toggling favourite:", e);
      }
    }; */}


  return (
    <View style={globalStyles.container}> 
    <ScrollView>  

      <View style={[globalStyles.paddingHorizontal, globalStyles.topContainer]}>

      <Image 
        source={{ uri: meal.strMealThumb }} 
        style={styles.Image} 
      />

      <Text style={[globalStyles.h2, globalStyles.textMargins]}>{meal.strMeal}</Text>

      {/* Later use Gemini to create a short text description of the recipe*/}
      <Text style={[globalStyles.subheading, globalStyles.textMargins]}>A delightful dish that combines flavors and textures to create a memorable culinary experience.</Text>
       
       {/* tags  */}
        <View style={globalStyles.tagContainer}>
            <Text style={[globalStyles.tag, globalStyles.categoryTag]}> {meal.strCategory} </Text>
            <Text style={[globalStyles.tag, globalStyles.areaTag]}>{meal.strArea} </Text>
            {/*splitting the tags string into individual tags */}
              {meal.strTags && meal.strTags.split(',').slice(0,3).map((tag, index) => (
              <Text key={index} style={[globalStyles.tag, globalStyles.otherTags]}>
                {tag.trim()}
              </Text>
            ))}
       </View>

       {/* <TouchableOpacity
          style={styles.favouriteButton}
          onPress={() => toggleFavouriteRecipe(item)}
        >
          <Text style={globalStyles.headerText}>
            {item.is_favourite === 1 ? '♥︎' : '♡'}
          </Text>
        </TouchableOpacity> */}
      
      {/* Option bar for Details, Ingredients, Instructions */}
        <View style={globalStyles.optionsBar}>
            <TouchableOpacity
            style={[globalStyles.optionButtonFlex, optionBarType === 'Details' ? globalStyles.optionButtonActive : null]}
            onPress={() => setOptionBarType('Details')}
            >
            <Text style={optionBarType === 'Details' ? globalStyles.optionButtonTextActive : globalStyles.optionButtonText}>Details</Text>
            </TouchableOpacity>

            <TouchableOpacity
            style={[globalStyles.optionButtonFlex, optionBarType === 'Ingredients' ? globalStyles.optionButtonActive : null]}
            onPress={() => setOptionBarType('Ingredients')}
            >
            <Text style={optionBarType === 'Ingredients' ? globalStyles.optionButtonTextActive : globalStyles.optionButtonText}>Ingredients</Text>
            </TouchableOpacity>

            <TouchableOpacity
            style={[globalStyles.optionButtonFlex, optionBarType === 'Instructions' ? globalStyles.optionButtonActive : null]}
            onPress={() => setOptionBarType('Instructions')}
            >
            <Text style={optionBarType === 'Instructions' ? globalStyles.optionButtonTextActive : globalStyles.optionButtonText}>Instructions</Text>
            </TouchableOpacity>
        </View>
      </View> 

      {(() => {
        switch (optionBarType) {
            case 'Details':
            return (
                <ScrollView style={styles.optionContent}>
                <View style= {[globalStyles.paddingHorizontal, globalStyles.textSection]}>
                    <Text style={globalStyles.h3}>Prep Time </Text>
                    <Text style={globalStyles.bodyText}>{`${randomPrepTime} minutes`} </Text>
                </View>

                <View style= {[globalStyles.paddingHorizontal, globalStyles.textSection]}>
                    <Text style={globalStyles.h3}>Cook Time </Text> 
                    <Text style={globalStyles.bodyText}>{`${randomCookTime} minutes`}</Text>  
                </View>

                <View style= {[globalStyles.paddingHorizontal, globalStyles.textSection]}>
                    <Text style={globalStyles.h3}>Servings </Text>
                    <Text style={globalStyles.bodyText}>{`${randomServings} servings`}</Text>   
                </View>
                </ScrollView>
            );

            case 'Ingredients':
            return (
                <ScrollView> 
                  <View style={[globalStyles.paddingHorizontal, globalStyles.textSection]}>
                   <Text style={globalStyles.h3}>Ingredients </Text>
                   {ingredientsList.map((item, index) => (
                      <Text key={index} style={globalStyles.bodyText}> {item}
                      </Text>
                    ))}
                   </View>
                </ScrollView>
            );

            case 'Instructions':
            return (
                <ScrollView>
                    <View style={[globalStyles.paddingHorizontal, globalStyles.textSection]}>
                        <Text style={globalStyles.h3}>Instructions </Text>
                        <Text style={globalStyles.bodyText}>{meal.strInstructions}</Text>
                    </View>
                </ScrollView>
            );

            default:
            return null;
        }
        })()}

     </ScrollView>

        {/* Bottom buttons for Grocery List and Log Meal */}
         <View style={styles.bottomButtons}>
            <TouchableOpacity 
            style={globalStyles.secondaryButton}
            onPress={() => navigation.navigate("Grocery List", {ingredients: ingredientsList})}
            >
                <Text style={globalStyles.secondaryButtonText}>Shop Ingredients</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={globalStyles.primaryButton}
                onPress={() => navigation.navigate("Log Meal", {photo: '../../assets/adaptive-icon.png'})}
            >
                <Text style={globalStyles.primaryButtonText}>Log Meal</Text>
            </TouchableOpacity>
        </View>
    </View>
    );
 
} 

const styles = StyleSheet.create({
  
  Image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },

  bottomButtons: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginVertical: 20,
  paddingHorizontal: 16,
  gap: 10
},

});
