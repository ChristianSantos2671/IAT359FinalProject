import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AddRecipeScreen from './src/screens/AddRecipeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LogMealScreen from './src/screens/LogMealScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator>
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
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="Log Meal" component={LogMealScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}