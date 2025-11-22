import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import globalStyles from '../utils/globalStyles';

// This screen shows the photo taken, a retake button to go back to the previous screen, and a Use Photo button that will go to the Suggested Recipes screen passing it the photo taken.
export default function CameraPreviewScreen({ route, navigation }) {
  const { previousScreen, photo } = route.params;

  const insets = useSafeAreaInsets();

  const navigateToCertainScreen = () => {
    if (previousScreen === 'Log Meal') {
      navigation.navigate('Log Meal', { photo });
    } else {
      navigation.navigate('Suggested Recipes', { photo });
    }
  }

  return (
    <View style={globalStyles.mainView}>
      {console.log('Photo received:', photo.uri)}
      <Image
        style={styles.image}
        source={{uri: photo.uri}}
      />
      
      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: globalStyles.colors.background}, {marginBottom: insets.bottom}]}
          onPress={() => navigation.goBack()}
        >
          <Text style={globalStyles.headerText2}>Retake</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, {marginBottom: insets.bottom}]}
          onPress={() => navigateToCertainScreen()}
        >
          <Text style={globalStyles.headerText2}>Use Photo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
  },
  buttonSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: globalStyles.sectionValues.sectionPadding,
  },
  button: {
    backgroundColor: globalStyles.colors.primary,
    padding: globalStyles.buttonValues.buttonPadding,
    borderWidth: globalStyles.buttonValues.buttonBorderWidth,
    borderColor: globalStyles.colors.text,
    borderRadius: globalStyles.buttonValues.buttonBorderRadius,
  },
});
