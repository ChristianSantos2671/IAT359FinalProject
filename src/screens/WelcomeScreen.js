import { View, Text, StyleSheet, Button } from "react-native";
import { useState } from "react";

export default function WelcomeScreen({ route, navigation }) {
  const initialName = route?.params?.userName ?? null;
  const initialColor = route?.params?.backgroundColor ?? null;

  const [userName, setUserName] = useState(initialName);
  const [backgroundColor, setBackgroundColor] = useState(initialColor);

  return (
    <View style = {[styles.container, {backgroundColor}]}>
      <Text>Welcome, {userName ? `, person ${userName}` : ''}</Text>
      <Button title="Back to Home" onPress={() => navigation.navigate("Home")}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});