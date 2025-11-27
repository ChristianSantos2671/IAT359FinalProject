import { View, Text, StyleSheet, TextInput, Image, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import filter from "lodash/filter";
import { signOut } from 'firebase/auth';
import { firebase_auth } from '../utils/firebaseConfig';
import globalStyles from "../utils/globalStyles";
import { useFocusEffect } from '@react-navigation/native';
import { saveRecipe, toggleFavourite, getRecipes } from '../utils/db';

const API_ENDPOINT = (query) =>
  `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;

export default function HomeScreen({navigation}) {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [fullData, setFullData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const insets = useSafeAreaInsets();

  //filter states 
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedArea, setSelectedArea] = useState([]);

  // sync favourites from DB whenever screen focuses
  useFocusEffect(
    React.useCallback(() => {
      const loadFavourites = async () => {
        try {
          const recipesFromDB = await getRecipes();
          setData(prevData =>
            prevData.map(meal => {
              const fav = recipesFromDB.find(r => r.name === meal.strMeal);
              return fav ? { ...meal, is_favourite: Number(fav.is_favourite) } : { ...meal, is_favourite: 0 };
            })
          );
        } catch (e) {
          console.error("Error syncing favourites:", e);
        }
      };
      loadFavourites();
    }, [])
  );

  // sign out 
  const logout = async () => {
    try {
      await signOut(firebase_auth);
      Alert.alert('You have been signed out successfully.');
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  // api loading the data 
  const fetchData = async(url) => {
    try {
      setLoading(true);
      const response = await fetch(url);
      const json = await response.json();

      // filter out meals with no thumbnail img
      const mealsWithThumb = (json.meals || []).filter(
        meal => meal.strMealThumb && meal.strMealThumb.trim() !== ""
      );

      setData(mealsWithThumb.map(m => ({ ...m, is_favourite: 0 }))); // initialise is_favourite
      setFullData(mealsWithThumb.map(m => ({ ...m, is_favourite: 0 }))); 
      console.log(mealsWithThumb);

    } catch (error) { 
      setError(error);
      Alert.alert("Could not search recipe", error.message);
      console.log(error);

    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData(API_ENDPOINT(""));
  } , []);
  
  useEffect(() => {
     filterMeals();
     }, [selectedCategory, selectedArea, searchQuery]);
 
 const contains = (meal, query) => {
   const { strMeal, strCategory, strArea, strTags } = meal;
   
   // convert all querries to lowercase 
   const formattedQuery = query.toLowerCase();
 
   // checking meal
   if (strMeal.toLowerCase().includes(formattedQuery)) return true;
 
   // checking category
   if (strCategory?.toLowerCase().includes(formattedQuery)) return true;
 
   // checking area
   if (strArea?.toLowerCase().includes(formattedQuery)) return true;
 
   // checking tags
   if (strTags) {
     // need to split tags 
     const tagsArray = strTags.split(',').map(tag => tag.trim().toLowerCase());
     if (tagsArray.some(tag => tag.includes(formattedQuery))) return true;
   }
 
   return false;
 };
 
 const filterMeals = () => {
   let filtered = fullData;
 
   if (selectedCategory.length > 0) {
     filtered = filtered.filter(meal => selectedCategory.includes(meal.strCategory));
   }
 
   if (selectedArea.length > 0) {
     filtered = filtered.filter(meal => selectedArea.includes(meal.strArea));
   }
 
   //filter on top of what is being searched
   if (searchQuery.trim() !== "") {
     filtered = filtered.filter(meal => contains(meal, searchQuery));
   }
 
   setData(filtered);
 };
 
 const resetFilters = () => {
    setSelectedCategory([]);
    setSelectedArea([]);
    setSearchQuery("");
    setData(fullData); // reset the displayed meals to all meals
 };

 {/* searching + filtering the data */}
 const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setData(fullData);
      return;
    }

    const formattedQuery = query.toLowerCase();
    const filteredData = filter(fullData, (meal) => contains(meal, formattedQuery));
    setData(filteredData);
 };

 const toggleFilters = (value, type) => {
  switch (type) {
    case 'category':
      setSelectedCategory(prev =>
        prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
      );
      break;

    case 'area':
      setSelectedArea(prev =>
        prev.includes(value) ? prev.filter(a => a !== value) : [...prev, value]
      );
      break;

    default:
      break;
    }
  };

// toggle favourite in DB and update list
const toggleFavouriteRecipe = async (meal) => {
  try {
    // Check if this meal already exists in DB
    const recipes = await getRecipes();
    const existing = recipes.find(r => r.name === meal.strMeal);

    if (existing) {
      // Meal exists → just toggle favourite
      const newValue = await toggleFavourite(existing.id, Number(existing.is_favourite));
      setData(prev =>
        prev.map(m =>
          m.strMeal === meal.strMeal ? { ...m, is_favourite: Number(newValue) } : m
        )
      );
    } else {
      // Meal not in DB → save as favourite
      await saveRecipe({
        name: meal.strMeal,
        ingredients: getIngredientsString(meal),
        instructions: meal.strInstructions || '',
        image_uri: meal.strMealThumb,
        is_favourite: 1,
      });

      setData(prev =>
        prev.map(m =>
          m.strMeal === meal.strMeal ? { ...m, is_favourite: 1 } : m
        )
      );
    }
  } catch (e) {
    console.error("Error toggling favourite:", e);
  }
};

// helper to convert meal object ingredients into string
const getIngredientsString = (meal) => {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      ingredients.push(`${measure || ""} ${ingredient}`.trim());
    }
  }
  return ingredients.join(", ");
};

return (
  <View style={globalStyles.container}>
    <View style={[globalStyles.topContainer, globalStyles.paddingHorizontal, { paddingTop: insets.top + 5 }]}>
      <View style={styles.signOutfeature}>
        <Text style={[globalStyles.h1, globalStyles.textMargins]} >Explore Recipes </Text>
        <TouchableOpacity onPress={logout}>
            <Ionicons name="log-out" size={30} color="#4CAF50" />
        </TouchableOpacity>
      </View>
      <Text style={[globalStyles.subheadingstyles, globalStyles.textMargins]} >Discover new flavors and find your next favorite dish. Search, browse, and get inspired by thousands of recipes. </Text>
      
      {/* search bar  + camera */}
      <View style={styles.searchContainer}>
        <TextInput
        placeholder="Search a recipe"
        clearButtonMode= "always"
        style={styles.searchBar}
        autoCapitalize="none"
        autoCorrect={false}
        value={searchQuery}
        onChangeText={(query) => handleSearch(query)}
        />

        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={22} />
          </TouchableOpacity>
        )}

        {/* camera icon + add searching with the camera */}
        <TouchableOpacity onPress={() => { navigation.navigate('CameraScreen', {previousScreen: 'Home'}) }}>
          <Ionicons name="camera" size={30} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      <View style={[globalStyles.tagContainer, styles.tagsSearch]}>
          <Text style={globalStyles.bodyText}>Popular tags:</Text>
          <TouchableOpacity onPress={() => toggleFilters('Vegetarian', 'category')}>
              <Text style={[globalStyles.tag, selectedCategory.includes('Vegetarian') ? globalStyles.categoryTag : null]}>Vegetarian</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleFilters('Seafood', 'category')}>
              <Text style={[globalStyles.tag, selectedCategory.includes('Seafood') ? globalStyles.categoryTag : null]}>Seafood</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleFilters('Dessert', 'category')}>
              <Text style={[globalStyles.tag, selectedCategory.includes('Dessert') ? globalStyles.categoryTag : null]}>Dessert</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleFilters('Side', 'category')}>
              <Text style={[globalStyles.tag, selectedCategory.includes('Side') ? globalStyles.categoryTag : null]}>Side</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => toggleFilters('Turkish', 'area')}>
              <Text style={[globalStyles.tag, selectedArea.includes('Turkish') ? globalStyles.areaTag : null]}>Turkish</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleFilters('British', 'area')}>
              <Text style={[globalStyles.tag, selectedArea.includes('British') ? globalStyles.areaTag : null]}>British</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleFilters('Canadian', 'area')}>
              <Text style={[globalStyles.tag, selectedArea.includes('Canadian') ? globalStyles.areaTag : null]}>Canadian</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleFilters('Japanese', 'area')}>
              <Text style={[globalStyles.tag, selectedArea.includes('Japanese') ? globalStyles.areaTag : null]}>Japanese</Text>
          </TouchableOpacity>

            <TouchableOpacity onPress={resetFilters}>
                <Text style={[globalStyles.tag, {color: 'red'}]}>Clear Filters</Text>
            </TouchableOpacity>
        </View>
      </View>
      {/* recipe list  */}
      <FlatList
        data={data}
        style={globalStyles.paddingHorizontal}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          
          <TouchableOpacity
            style={globalStyles.itemContainer}
            onPress={() => navigation.navigate('Recipe Details', { meal: item })} 
          >
              <Image 
              source={{ uri: item.strMealThumb }} 
              style={globalStyles.thumbnail} 
              />

              <View style={globalStyles.mealCardTextContainer}>
                  <View style={globalStyles.favouriteContainer}>
                    <Text style={globalStyles.h3}>{item.strMeal}</Text>
                    <TouchableOpacity
                    style={globalStyles.favouriteButton}
                    onPress={() => toggleFavouriteRecipe(item)}>
                      <Text style={[globalStyles.h3,  item.is_favourite === 1 && globalStyles.favouriteActive]}>
                        {item.is_favourite === 1 ? '♥︎' : '♡'}
                      </Text>
                   </TouchableOpacity>
                  </View>
                <View style={globalStyles.tagContainer}>
                  <Text style={[globalStyles.tag, globalStyles.categoryTag]}> {item.strCategory} </Text>
                  <Text style={[globalStyles.tag, globalStyles.areaTag]}> {item.strArea} </Text>
                  {/*splitting the tags string into individual tags */}
                  {item.strTags && item.strTags.split(',').slice(0,3).map((tag, index) => (
                    <Text key={index} style={[globalStyles.tag, globalStyles.otherTags]}>
                      {tag.trim()}
                    </Text>
                  ))}
                </View>
              </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={globalStyles.logMealButton}
        onPress={() => navigation.navigate('Log Meal', {previousScreen: 'Home', photo: '../../assets/adaptive-icon.png'})}
      >
        <Image
          style={globalStyles.logMealImage}
          source={require('../../assets/adaptive-icon.png')}
        />
      </TouchableOpacity>
    </View>
  );
  }

const styles = StyleSheet.create({
  signOutfeature: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: globalStyles.colors.border,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  
  searchBar: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },

});
