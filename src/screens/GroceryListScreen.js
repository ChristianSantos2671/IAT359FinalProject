import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Button, FlatList } from 'react-native';
import rootStyles from '../utils/rootStyles';

export default function GroceryListScreen() {
  const [ingredients, setIngredients] = useState([]);
  const [ingridient, setIngredient] = useState('');

  const deleteIngridents = (index) => {
    let newIngridients = [...ingredients];
    newIngridients.splice(index, 1);
    setIngredients(newIngridients);
  }
  
  return (
    <View style={styles.mainView}>
      <ScrollView>
        <View>
          {/* Camera access or upload photo here */}
        </View>

        <View style={styles.view}>
          <Text style={styles.header}>Recipe Name</Text>
          <TextInput style={styles.textInput} placeholder="eg. Beef Wellington"/>
        </View>

        <View style={styles.view}>
          <Text style={styles.header}>Ingrdients</Text>
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

        <View style={styles.view}>
          <Text style={styles.header}>Instructions</Text>
          <TextInput
            style={styles.textInput}
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
  ingredientsList: {
    borderWidth: rootStyles.section.borderWidth,
    backgroundColor: rootStyles.colors.backgroundSecondary,
    marginTop: 10,
    padding: rootStyles.section.padding,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 16,
    backgroundColor: rootStyles.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 10,
  },
  ingridientName: {
    fontSize: rootStyles.tagText.fontSize,
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