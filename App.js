import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { firebase_auth } from './src/utils/firebaseConfig.js';
import { initRecipesTable } from './src/utils/db.js';
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from 'react-native-safe-area-context';


import { ActivityIndicator, View, TextInput, Text } from 'react-native';

//fonts
import { useFonts } from "expo-font";
import { Quicksand_300Light, Quicksand_400Regular, Quicksand_500Medium, Quicksand_600SemiBold, Quicksand_700Bold } from "@expo-google-fonts/quicksand";


// Importing screens
import AddRecipeScreen from './src/screens/AddRecipeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LogMealScreen from './src/screens/LogMealScreen';
import SignInScreen from './src/screens/SignInScreen';
import HomeScreen from './src/screens/HomeScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import GroceryListScreen from './src/screens/GroceryListScreen';
import RecipeDetailsScreen from './src/screens/RecipeDetailsScreen';
import CameraScreen from './src/screens/CameraScreen';
import CameraPreviewScreen from './src/screens/CameraPreviewScreen';
import SuggestedRecipesScreen from './src/screens/SuggestedRecipesScreen';
import FaveRecipeDetailsScreen from './src/screens/FaveRecipeDetailsScreen.js';
import globalStyles from './src/utils/globalStyles.js';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


// These tabs are used the show the four major sections of the app.
function Tabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator 
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#fff",
          paddingTop: 6,
          paddingBottom: insets.bottom + 6,
          height: 65 + insets.bottom,
          borderTopWidth: 0,
        }, 
        tabLabelStyle: globalStyles.tabLabelStyle,         
        tabBarActiveTintColor: globalStyles.tabBarActiveTint,
        tabBarInactiveTintColor: globalStyles.tabBarInactiveTint,
        }}
    >
{/* HOME */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />

      {/* GROCERY LIST */}
      <Tab.Screen
        name="Grocery List"
        component={GroceryListScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "cart" : "cart-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />

      {/* ADD RECIPE */}
      <Tab.Screen
        name="Add Recipe"
        component={AddRecipeScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "add-circle" : "add-circle-outline"}
              size={28}
              color={color}
            />
          ),
        }}
      />

      {/* PROFILE */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false, 
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {

  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(true);
  
  // ------------------------------
  // LOAD FONTS
  // ------------------------------
  const [fontsLoaded] = useFonts({
    Quicksand_300Light,
    Quicksand_400Regular,
    Quicksand_500Medium,
    Quicksand_600SemiBold,
    Quicksand_700Bold,
  });

  if (fontsLoaded) {
    // Default for ALL <Text>
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.style = { fontFamily: "Quicksand_400Regular" };

    TextInput.defaultProps = TextInput.defaultProps || {};
    TextInput.defaultProps.style = { fontFamily: "Quicksand_400Regular" };
  }

  useEffect(() => {
    // Initialize the recipes database table.
    initRecipesTable().catch(err => {
      console.error('Failed to initialize recipes table:', err);
    });

    const unsubscribe = onAuthStateChanged(firebase_auth, (u) => {
      setUser(u);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
    }, [initializing]);

  if (initializing) {
      return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" />
          </View>
      );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>

        {/*// Checking if user is logged in*/}
        {user ? (
          <>
            <Stack.Screen 
            name="MainTabs" 
            component={Tabs} 
            options={{ headerShown: false }} 
            />

            {/* Stack screens that appear on top of tabs */}
            <Stack.Screen 
              name="Log Meal" 
              component={LogMealScreen}
            />

            <Stack.Screen
              name="Recipe Details" 
              component={RecipeDetailsScreen} 
            />

            <Stack.Screen 
            name="Saved Recipe Details" 
            component={FaveRecipeDetailsScreen} 
            />


            {/* These are the three screens for the camer and image recognition feature. */}
            <Stack.Screen
              name="CameraScreen"
              component={CameraScreen} 
            />

            <Stack.Screen
              name="Camera Preview"
              component={CameraPreviewScreen}
            />

            <Stack.Screen
              name="Suggested Recipes"
              component={SuggestedRecipesScreen}
            />          
          </>
        ) : (
          <>
            {/*User not logged in*/}
            <Stack.Screen 
            name="SignIn" 
            component={SignInScreen} 
            options={{ headerShown: false }}
            />

            <Stack.Screen 
            name="SignUp" 
            component={SignUpScreen} 
            options={{ headerShown: false }}
            />
          </>
        )}

      </Stack.Navigator>
    </NavigationContainer>
  );
}
