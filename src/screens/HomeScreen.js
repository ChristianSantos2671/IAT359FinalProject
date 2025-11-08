{/*import { useState, useEffect } from "react";
import { Button, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { saveUserPrefs, loadUserPrefs, removeUserPrefs } from "./utils/storage";

export default function HomeScreen({ navigation }) {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const colors = ["red", "green", "blue", "orange"];

  useEffect(() => {
    (async () => {
      const prefs = await loadUserPrefs();
      if (prefs?.name) setName(prefs.name);
      if (prefs?.color) setSelectedColor(prefs.color);
    })()
  }, []);

  const handleSubmit = async () => {
    if (name.trim() && selectedColor) {

      await saveUserPrefs(name.trim(), selectedColor);

      navigation.navigate("Welcome", {
        userName: name.trim(),
        backgroundColor: selectedColor
      });
    } else {
      Alert.alert("Missing info");
    }
  }
  
  return (
    <View>
      <Text>Enter your name:</Text>
      <TextInput
        placeholder = "Name"
        value = {name}
        onChangeText = {setName}
      />

      <View style = {styles.colorRow}>
        {colors.map((c) => (
          <TouchableOpacity
            key = {c}
            onPress = {() => setSelectedColor(c)}
            style = {[styles.colorSwatch,
              { backgroundColor: c, borderWidth: selectedColor === c ? 3 : 1 }
            ]}
          />
        ))}
      </View>
      
      <Button
        title = "Submit"
        onPress = {handleSubmit}
      />
    </View>
  )
}

const styles = StyleSheet.create ({
  colorRow: {
    flexDirection: "row",
    gap: 12,
    marginVertical: 10,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderWidth: "#111",
    borderRadius: 8,
  },
}); */}

import { View, Text, StyleSheet, Button, TextInput, Image, FlatList, TouchableOpacity, Platform, StatusBar, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect, use } from "react";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import filter from "lodash/filter";

const API_ENDPOINT = (query) =>
  `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;

export default function HomeScreen({navigation}) {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [fullData, setFullData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

// api loading the data 
  const fetchData = async(url) => {
    try {
      setLoading(true);
      const response = await fetch(url);
      const json = await response.json();
      setData(json.meals || []);
      console.log(json.meals);
      setFullData(json.meals || []);

    } catch (error) { 
      setError(error);
      Alert.alert("Could not search recipe", e.message);
      console.log(error);

    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData(API_ENDPOINT(""));
  } , []);
  
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

  const contains = ({ strMeal }, query) => { 
    return strMeal.toLowerCase().includes(query);
  }; 

  if(isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size={'large'} color="green" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.topContainer, styles.paddingHorizontal]}>
        <Text style={[styles.h1, styles.textMargins]} >Explore Recipes </Text>
        <Text style={[styles.subheadingstyles, styles.textMargins]} >Discover new flavors and find your next favorite dish. Search, browse, and get inspired by thousands of recipes. </Text>
        
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
        {/* camera icon  */}
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="camera" size={30} color="#4CAF50" />
          </TouchableOpacity>
        </View>

        {/* tags  */}
        <View style={styles.tagContainer}>
          <TouchableOpacity>
            <Text style={styles.tag}> Vegan </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.tag}> Gluten-Free </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.tag}> Quick & Easy </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.tag}> Desserts </Text>
          </TouchableOpacity>
        </View>
      </View>
     {/* recipe list  */}
    <FlatList
      data={data}
      style={styles.paddingHorizontal}
      keyExtractor={(item) => item.idMeal}
      renderItem={({ item }) => (
        
        <TouchableOpacity
          style={[styles.itemContainer, styles.dropshadow]}
          onPress={() => navigation.navigate('Recipe Details', { meal: item })} 
        >
            <Image 
            source={{ uri: item.strMealThumb }} 
            style={styles.thumbnail} 
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.h3}>{item.strMeal}</Text>
              <Text
                style={styles.bodyText}
                numberOfLines={3}
                ellipsizeMode="tail"
              >
                {item.strInstructions}
              </Text>
            </View>
        </TouchableOpacity>
      )}
    />
    </SafeAreaView>
  );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 0,
  },
// global styles 
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
    fontColor: "#3f3f3fff",
    marginBottom: 6,
  },

  bodyText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 18,
    maxWidth: '95%',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // dropshadow style for meal items, logs, etc
  dropshadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },

  textMargins: {
    marginBottom: 15,
  },

  paddingHorizontal: {
    paddingHorizontal: 16,
  },

  topContainer: {
    backgroundColor: 'white',
    paddingBottom: 10,
    marginBottom: 10,
  },

  // page specific styles
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  
  searchBar: {
    flex: 3,
    height: 40,
    fontSize: 16,
  },

  itemContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
    gap: 15,   
    width: '100%',
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
  },

  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
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
});