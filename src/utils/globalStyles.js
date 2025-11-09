import { StyleSheet } from 'react-native';

const colors = {
  primary: '#4CAF50',
  background: '#F5F5F5',
  backgroundSecondary: '#cbcbcbff',
  text: '#212121',
};

const sectionValues = {
  sectionBorderWidth: 3,
  sectionPadding: 10,
  sectionMargin: 15,
};

const buttonValues = {
  buttonBorderWidth: 3,
  buttonBorderRadius: 30,
  buttonPadding: 10,
  buttonMargin: 10,
};

const globalStyles = StyleSheet.create({
  colors,
  buttonValues,
  sectionValues,
  mainView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  view: {
    margin: sectionValues.sectionMargin,
  },
  headerText: {
    fontSize: 14*1.5,
    fontWeight: 'bold',
  },
  headerText2: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  bodyText: {
    fontSize: 10,
  },
  tagText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  textInput: {
    borderColor: colors.text,
    borderWidth: sectionValues.sectionBorderWidth,
    padding: sectionValues.sectionPadding,
    marginTop: 5,
  },
  logMealButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: buttonValues.buttonBorderRadius,
    borderWidth: buttonValues.buttonBorderWidth,
    borderColor: colors.text,
    padding: buttonValues.buttonPadding,
    margin: buttonValues.buttonMargin,
  },
  logMealImage: {
    width: 40,
    height: 40,
  },
});

export default globalStyles;