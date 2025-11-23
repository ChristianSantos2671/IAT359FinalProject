import { StyleSheet } from 'react-native';


const colors = {
  primary: '#4CAF50',
  background: '#F5F5F5',
  backgroundSecondary: '#cbcbcbff',
  topContainer: '#ffffff',
  text: '#212121',
  subtext: "#616161",
  border: "#E0E0E0",
  tagBackground: "#F5F5F5"
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

  // global styles 

  container: {
    flex: 1,
    width: '100%',
    padding: 0,
    margin: 0,
    backgroundColor: colors.background,
  },

  h1: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.text,
  },
  h2: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.text,
  },

  h3: {
    fontSize: 16,
    fontWeight: "600",
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
    width: 50,
    height: 50,
  },

  // input containers 

  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  
  input: {
    backgroundColor: '#fff',
    paddingVertical: 15,
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
    paddingHorizontal: 16,
  },

  topContainer: {
    backgroundColor: 'white',
    paddingBottom: 10,
    marginBottom: 10,
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
  },

  categoryTag: {
    backgroundColor: "#E8F5E9", // light green tint
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
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
    },

  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
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
  }

});

export default globalStyles;