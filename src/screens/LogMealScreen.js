import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";

import globalStyles from '../utils/globalStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LogMealScreen() {
  const insets = useSafeAreaInsets();

	return (
		<View style={globalStyles.mainView}>
      <ScrollView>
        <View style={globalStyles.view}>
          <Text style={globalStyles.headerText2}>Recipe Name</Text>
          <TextInput style={globalStyles.textInput} placeholder="eg. Beef Wellington"/>
        </View>

        <View style={globalStyles.view}>
          <Text style={globalStyles.headerText2}>Recipe</Text>
          <TextInput
            style={globalStyles.textInput}
            multiline={true}
            placeholder="Step 1: ..."
          />
        </View>

        <View style={globalStyles.view}>
          <Text style={globalStyles.headerText2}>My Experience</Text>
          <TextInput
            style={globalStyles.textInput}
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
          <Text style={globalStyles.headerText2}>Upload My Meal</Text>
        </TouchableOpacity>
      </View>
		</View>
	);
}

const styles = StyleSheet.create({
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
    backgroundColor: globalStyles.colors.primary,
    borderWidth: globalStyles.button.borderWidth,
    borderRadius: globalStyles.button.borderRadius,
    paddingVertical: globalStyles.button.padding,
    paddingHorizontal: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
