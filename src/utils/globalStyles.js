import { StyleSheet } from 'react-native';


const colors = {
  primary: '#4CAF50',
  secondary: '#E8F5E9',
  background: '#F5F5F5',
  backgroundSecondary: '#cbcbcbff',
  topContainer: '#ffffff',
  text: '#212121',
  subtext: "#616161",
  border: "#E0E0E0",
  tagBackground: "#F5F5F5"
};

const sectionValues = {
  sectionBorderWidth: 1,
  sectionPadding: 16,
  sectionMargin: 16,
  sectionRadius: 16,
};

const buttonValues = {
  buttonBorderWidth: 1,
  buttonBorderRadius: 30,
  buttonPaddingHorizontal: 20,
  buttonPaddingVertical: 10,
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
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: buttonValues.buttonBorderRadius,
    borderWidth: buttonValues.buttonBorderWidth,
    borderColor: colors.border,
    padding: buttonValues.buttonPadding,
    margin: 20,
  },
  
  logMealImage: {
    width: 40,
    height: 40,
  },

  // global styles 

  container: {
    flex: 1,
    width: '100%',
    padding: 0,
    margin: 0,
    backgroundColor: colors.background,
  },

  // TAB NAVIGATION STYLING 

  tabLabelStyle: {
    fontSize: 12,
  },

  tabBarActiveTint: colors.primary,       
  tabBarInactiveTint: colors.subtext,     


  // text styling
  h1: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.text,
  },
  h2: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },

  h3: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },

  h4: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  
  subheading: {
    marginBottom: 6,
    fontSize: 16,
    color: colors.subtext,
    lineHeight: 20,
  },

  bodyText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 18,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // logo 

  logo: {
    width: 60,
    height: 60,
    borderRadius: sectionValues.sectionRadius
  },

  // option bars / tabs

  optionsBar: {
    flexDirection: 'row',
    marginVertical: 10,
    border: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  optionButtonFlex: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  optionButtonActive: {
    backgroundColor: colors.primary,
  },

  optionButtonText: {
    color: colors.primary,
  },

  optionButtonTextActive: {
    color: 'white',
    fontWeight: '600',
  },

  // input containers 

  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  
  input: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // dropshadow style for meal items, logs, etc
  dropshadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },

  textMargins: {
    marginBottom: 15,
  },

  paddingHorizontal: {
    paddingHorizontal: sectionValues.sectionPadding,
  },

  topContainer: {
    backgroundColor: 'white',
    paddingBottom: 15,
    marginBottom: 10,
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  // tag styles
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginTop: 5,
  },

  tag: {
    fontSize: 12,
    backgroundColor: colors.tagBackground,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    includeFontPadding: false,
  },

  categoryTag: {
    backgroundColor: colors.secondary, // light green tint
    color: colors.primary,
  },
  
  areaTag: {
    backgroundColor: "#FFF3E0", // orange tint
    color: "#E65100",
  },

  otherTags: {
    backgroundColor: "#E3F2FD", // blue tint
    color: "#1565C0",
  },

  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: buttonValues.buttonBorderRadius,
    flex: 1,
    alignItems: "center",
    },

  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
    alignItems: "center",
    borderRadius: buttonValues.buttonBorderRadius,
    borderWidth: buttonValues.buttonBorderWidth,
    borderColor: colors.primary
    },

  primaryButtonText: {
    color: 'white',
    fontWeight: "600",
    },

  secondaryButtonText: {
    color: colors.primary,
    fontWeight: "600",
    },
  
   textSection: {
    marginBottom: 15,
  },

  buttonFix: {
    flex: 0,
    marginLeft: 0,
  },

  // meal cards
  
  itemContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginTop: 10,
    gap: 15,   
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: sectionValues.sectionRadius,
    borderWidth: sectionValues.sectionBorderWidth,
    borderColor: colors.border,
  },

  mealCardTextContainer: {
    justifyContent: 'flex-start',
  },

  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },

  // favourite button
  favouriteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    margin: 4
  },

   
   favouriteButton: {
    width: '10%',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: colors.secondary,
    padding: 0,
  },

  deletePosition: {
    position: 'absolute',
    left: '95%',
    top: 18,
    zIndex: 1,
  },

  deleteButton: {
    alignItems: 'center',
    width: '10%',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: colors.secondary,
    paddingVertical: 6,
  },

  favouriteActive: {
    color: colors.primary
  },

});

export default globalStyles;