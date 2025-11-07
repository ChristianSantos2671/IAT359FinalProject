import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";

import globalStyles from '../utils/globalStyles';

export default function AddRecipeScreen() {
  const [ingredients, setIngredients] = useState([]);
  const [ingridient, setIngredient] = useState('');

  const deleteIngridents = (index) => {
    let newIngridients = [...ingredients];
    newIngridients.splice(index, 1);
    setIngredients(newIngridients);
  }
  
  return (
    <View style={globalStyles.mainView}>
      <ScrollView>
        <View>
          {/* Camera access or upload photo here */}
        </View>

        <View style={globalStyles.view}>
          <Text style={globalStyles.headerText2}>Recipe Name</Text>
          <TextInput style={globalStyles.textInput} placeholder="eg. Beef Wellington"/>
        </View>

        <View style={globalStyles.view}>
          <Text style={globalStyles.headerText2}>Ingrdients</Text>
          <FlatList
            style={styles.ingredientsList}
            scrollEnabled={false}
            data={ingredients}
            renderItem={({item, index}) => (
              <View style={styles.tag}>
                <Text style={styles.ingridientName}>{item.title}</Text>
                <TouchableOpacity
                  onPress={() => {
                    deleteIngridents(index);
                  }
                }>
                  <Text style={styles.closeButton}> X </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        <View style={globalStyles.view}>
          <Text style={globalStyles.headerText2}>Instructions</Text>
          <TextInput
            style={globalStyles.textInput}
            multiline={true}
            placeholder="Step 1: ..."
          />
        </View>
      </ScrollView>

      <View style={styles.uploadButtonSection}>
        <TouchableOpacity style={styles.uploadButton}>
          <Text style={styles.uploadText}>Upload Recipe</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ingredientsList: {
    borderWidth: globalStyles.section.borderWidth,
    backgroundColor: globalStyles.colors.backgroundSecondary,
    marginTop: 10,
    padding: globalStyles.section.padding,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 16,
    backgroundColor: globalStyles.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 10,
  },
  ingridientName: {
    fontSize: globalStyles.tagText.fontSize,
    marginRight: 5,
  },
  closeButton: {
    padding: 2,
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
    backgroundColor: globalStyles.colors.primary,
    borderWidth: globalStyles.button.borderWidth,
    borderRadius: globalStyles.button.borderRadius,
    paddingVertical: globalStyles.button.padding,
    paddingHorizontal: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    fontSize: globalStyles.headerText.fontSize,
    fontWeight: globalStyles.headerText.fontWeight,
  },
});