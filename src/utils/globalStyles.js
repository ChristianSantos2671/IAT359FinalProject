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

const globalStyles = StyleSheet.create({
  colors,
  section: {
    borderWidth: sectionValues.sectionBorderWidth,
    padding: sectionValues.sectionPadding,
    margin: sectionValues.sectionMargin,
  },
  mainView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  view: {
    margin: sectionValues.sectionMargin,
  },
  button: {
    borderWidth: 3,
    borderRadius: 30,
    padding: 10,
    margin: 10,
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
});

export default globalStyles;