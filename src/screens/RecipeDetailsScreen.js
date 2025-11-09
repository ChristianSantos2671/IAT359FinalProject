import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import globalStyles from '../utils/globalStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
      
      {/* Option bar for Details, Ingredients, Instructions */}
        <View style={styles.optionsBar}>
            <TouchableOpacity
            style={[styles.optionButtonFlex, optionBarType === 'Details' ? styles.optionButtonActive : null]}
            onPress={() => setOptionBarType('Details')}
            >
            <Text style={optionBarType === 'Details' ? styles.optionButtonTextActive : styles.optionButtonText}>Details</Text>
            </TouchableOpacity>

            <TouchableOpacity
            style={[styles.optionButtonFlex, optionBarType === 'Ingredients' ? styles.optionButtonActive : null]}
            onPress={() => setOptionBarType('Ingredients')}
            >
            <Text style={optionBarType === 'Ingredients' ? styles.optionButtonTextActive : styles.optionButtonText}>Ingredients</Text>
            </TouchableOpacity>

            <TouchableOpacity
            style={[styles.optionButtonFlex, optionBarType === 'Instructions' ? styles.optionButtonActive : null]}
            onPress={() => setOptionBarType('Instructions')}
            >
            <Text style={optionBarType === 'Instructions' ? styles.optionButtonTextActive : styles.optionButtonText}>Instructions</Text>
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
            onPress={() => navigation.navigate("Grocery List")}
            >
                <Text style={globalStyles.secondaryButtonText}>Shop Ingredients</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={globalStyles.primaryButton}
                onPress={() => navigation.navigate("LogMeal")}
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

  optionsBar: {
    flexDirection: 'row',
    marginVertical: 10,
    border: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  optionButtonFlex: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  optionButtonActive: {
    backgroundColor: globalStyles.colors.primary,
  },

  optionButtonText: {
    color: globalStyles.colors.primary,
  },

  optionButtonTextActive: {
    color: 'white',
    fontWeight: '600',
  },

  bottomButtons: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginVertical: 20,
  paddingHorizontal: 16,
},

});
