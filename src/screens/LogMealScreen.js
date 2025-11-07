import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";

import rootStyles from '../utils/rootStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LogMealScreen() {
  const insets = useSafeAreaInsets();

	return (
		<View style={styles.mainView}>
      <ScrollView>
        <View style={styles.view}>
          <Text style={styles.header}>Recipe Name</Text>
          <TextInput style={styles.textInput} placeholder="eg. Beef Wellington"/>
        </View>

        <View style={styles.view}>
          <Text style={styles.header}>Recipe</Text>
          <TextInput
            style={styles.textInput}
            multiline={true}
            placeholder="Step 1: ..."
          />
        </View>

        <View style={styles.view}>
          <Text style={styles.header}>My Experience</Text>
          <TextInput
            style={styles.textInput}
            multiline={true}
            placeholder="This recipe was delicious because..."
          />
        </View>

        <View>
          {/* Camera access or upload photo here */}
        </View>
      </ScrollView>

      <View style={[styles.uploadButtonSection, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity style={styles.uploadButton}>
          <Text style={styles.uploadText}>Upload My Meal</Text>
        </TouchableOpacity>
      </View>
		</View>
	);
}

const styles = StyleSheet.create({
	mainView: {
		flex: 1,
		backgroundColor: rootStyles.colors.background,
  },
  view: {
    margin: rootStyles.section.margin,
  },
  header: {
    fontSize: rootStyles.headerText.fontSize,
    fontWeight: rootStyles.headerText.fontWeight,
  },
  textInput: {
    borderColor: rootStyles.colors.text,
    borderWidth: rootStyles.section.borderWidth,
    padding: rootStyles.section.padding,
    marginTop: 5,
  },
    uploadButtonSection: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
    },
    uploadButton: {
      backgroundColor: rootStyles.colors.primary,
      borderWidth: rootStyles.button.borderWidth,
      borderRadius: rootStyles.button.borderRadius,
      paddingVertical: rootStyles.button.padding,
      paddingHorizontal: 100,
      alignItems: 'center',
      justifyContent: 'center',
    },
    uploadText: {
      fontSize: rootStyles.headerText.fontSize,
      fontWeight: rootStyles.headerText.fontWeight,
    },
});
