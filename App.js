import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { firebase_auth } from './src/utils/firebaseConfig.js';


// Importing screens
import AddRecipeScreen from './src/screens/AddRecipeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LogMealScreen from './src/screens/LogMealScreen';
import SignInScreen from './src/screens/SignInScreen';
import HomeScreen from './src/screens/HomeScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import GroceryListScreen from './src/screens/GroceryListScreen';
import RecipeDetailsScreen from './src/screens/RecipeDetailsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
        headerShown: false }}
      />

      <Tab.Screen
        name="Grocery List"
        component={GroceryListScreen}
      />

      <Tab.Screen
        name="Add Recipe"
        component={AddRecipeScreen}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}

export default function App() {

  const [user, setUser] = useState(null)
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(firebase_auth, (u) => {
        setUser(u);
        if (initializing) setInitializing(false);
      });
      return unsubscribe;
      }, [initializing]);

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
          name="LogMeal" 
          component={LogMealScreen} />

          <Stack.Screen name="Recipe Details" 
          component={RecipeDetailsScreen} 
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

            <Stack.Screen name="SignUp" 
            component={SignUpScreen} 
            options={{ headerShown: false }}
            />
          </>
        )}

      </Stack.Navigator>
    </NavigationContainer>
  );
}