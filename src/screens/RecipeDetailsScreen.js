import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function RecipeDetailsScreen({navigation, route}) {
  const { meal } = route.params; 
  const [optionBarType, setOptionBarType] = useState('Details');

  return (
    <View style={styles.container}>
      <View style={[styles.paddingHorizontal, styles.topContainer]}>

      <Image 
        source={{ uri: meal.strMealThumb }} 
        style={styles.Image} 
      />

      <Text style={[styles.h2, styles.textMargins]}>{meal.strMeal}</Text>
      {/* short description of the recipe*/}
      <Text style={[styles.subheading, styles.textMargins]}>Recipe details...Vivamus id hendrerit ipsum, et suscipit ex. Sed rutrum consectetur lacus. Phasellus posuere turpis ipsum, sit amet finibus est cursus quis. Integer viverra dolor a tellus mattis, id ullamcorper elit varius.  </Text>
      
       {/* tags  */}
        <View style={styles.tagContainer}>
            {/*include country tag*/}
            <TouchableOpacity>
                <Text style={styles.tag}> {meal.strArea} </Text>
            </TouchableOpacity>
            {/*include any special tag like vegan, vegetarian*/}
            <TouchableOpacity>
                <Text style={styles.tag}> Vegan </Text>
            </TouchableOpacity>
            {/*include difficulty tag*/}
            <TouchableOpacity>
                <Text style={styles.tag}> Beginner-Friendly </Text>
            </TouchableOpacity>
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
                <View style= {[styles.paddingHorizontal, styles.textSection]}>
                    <Text style={styles.h3}> Nutritions </Text>
                    <Text styles={styles.bodyText}> Inserts nutritients </Text>
                    </View>

                <View style= {[styles.paddingHorizontal, styles.textSection]}>
                    <Text style={styles.h3}> Prep Time </Text>
                    <Text styles={styles.bodyText}> Inserts prep time </Text>
                </View>

                <View style= {[styles.paddingHorizontal, styles.textSection]}>
                    <Text style={styles.h3}> Cook Time </Text> 
                    <Text styles={styles.bodyText}> Inserts cook time </Text>  
                </View>

                <View style= {[styles.paddingHorizontal, styles.textSection]}>
                    <Text style={styles.h3}> Servings </Text>
                    <Text styles={styles.bodyText}> Inserts servings </Text>   
                </View>
                </ScrollView>
            );

            case 'Ingredients':
            return (
                <ScrollView> 
                    <View style={[styles.paddingHorizontal, styles.textSection]}>
                   <Text style={styles.h3}> Ingredients </Text>
                   <Text> Ingredients list + measurements of things </Text>
                   </View>
                </ScrollView>
            );

            case 'Instructions':
            return (
                <ScrollView>
                    <View style={[styles.paddingHorizontal, styles.textSection]}>
                        <Text style={styles.h3}>Instructions </Text>
                        <Text style={styles.bodyText}>{meal.strInstructions}</Text>
                    </View>
                </ScrollView>
            );

            default:
            return null;
        }
        })()}

        {/* Bottom buttons for Grocery List and Log Meal */}
         <View style={styles.bottomButtons}>
            <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Grocery List')}
            >
                <Text style={styles.secondaryButtonText}>Shop Ingredients</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => navigation.navigate("LogMeal")}
            >
                <Text style={styles.secondaryButtonText}>Log Meal</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
 
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingTop: 20,
  },

  h1: {
    color: 'green',
    fontWeight: '700',
    fontSize: 36,
  },
  h2: {
    fontSize: 24,
    fontWeight: "600",
  },
  h3: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  subheading: {
    fontSize: 16,
    color: "#3f3f3fff",
    marginBottom: 6,
  },
  Image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },

  paddingHorizontal: {
    paddingHorizontal: 16,
  },
  topContainer: {
    backgroundColor: 'white',
    paddingBottom: 10,
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
    backgroundColor: '#4CAF50',
  },

  optionButtonText: {
    color: '#4CAF50',
  },

  optionButtonTextActive: {
    color: 'white',
    fontWeight: '600',
  },

  textSection: {
    marginBottom: 15,
  },

   tagContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },

  tag: { 
    backgroundColor: '#4CAF50',
    textAlign: 'center',
    color: '#fff',
    paddingHorizontal: 12,  
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },

  textMargins: {
    marginBottom: 15,
  }, 

  bottomButtons: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginVertical: 20,
  paddingHorizontal: 16,
},

primaryButton: {
backgroundColor: "#4CAF50",
paddingVertical: 10,
paddingHorizontal: 20,
borderRadius: 8,
flex: 1,
marginLeft: 8,
alignItems: "center",
},

secondaryButton: {
backgroundColor: "#f2f2f2",
paddingVertical: 10,
paddingHorizontal: 20,
borderRadius: 8,
flex: 1,
marginRight: 8,
alignItems: "center",
},

primaryButtonText: {
color: "#fff",
fontWeight: "600",
},

secondaryButtonText: {
color: "#4CAF50",
fontWeight: "600",
},
  
});
