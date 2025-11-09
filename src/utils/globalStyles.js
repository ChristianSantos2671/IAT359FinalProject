import { StyleSheet } from 'react-native';


const colors = {
  primary: '#4CAF50',
  background: '#e8e6e6ff',
  backgroundSecondary: '#cbcbcbff',
  topContainer: '#ffffff',
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

  // global styles 

  container: {
    flex: 1,
    width: '100%',
    padding: 0,
    margin: 0,
    backgroundColor: colors.background,
  },

   h1: {
     color: colors.primary,
     fontWeight: '700',
     fontSize: 36,
  },

  h2: {
    fontSize: 24,
    fontWeight: "600",
  },

   h3: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  
  subheading: {
    fontSize: 16,
    fontColor: "#3f3f3fff",
    marginBottom: 6,
  },

  bodyText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 18,
    maxWidth: '95%',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    width: '100%',
  },

  tag: { 
    textAlign: 'center',
    color: '#fff',
    paddingHorizontal: 8,  
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 2,
    fontSize: 12,
    marginBottom: 4,
  },

  areaTag: {
    backgroundColor: '#f4a259',
  },

  categoryTag: {
    backgroundColor: '#8cb369',
  },

  otherTags: {
    backgroundColor: '#177e89',
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

});

export default globalStyles;