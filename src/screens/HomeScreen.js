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

import { View, Text, StyleSheet, Button } from "react-native";
import { useState } from "react";

export default function HomeScreen() {
    return (
        <View>
            <Text>HomeScreen</Text>
        </View>
    );
}