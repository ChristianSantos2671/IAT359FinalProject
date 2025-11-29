import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import globalStyles from '../utils/globalStyles';

/**
 * This screen displays the photo that was just taken using the camera.
 * It provides two options:
 *   1. Retake — goes back to the camera to capture again.
 *   2. Use Photo — navigates to the correct next screen, depending on where the user came from.
 */
export default function CameraPreviewScreen({ route, navigation }) {
  // Destructure passed parameters from route.
  const { previousScreen, photo } = route.params;

  // Handles safe area spacing for devices with notches.
  const insets = useSafeAreaInsets();

  /**
   * Determines which screen to navigate to after the user selects "Use Photo":
   * - If coming from "Log Meal", go back to the Log Meal screen with the photo.
   * - If coming from "Add Recipe", return to Add Recipe screen with the photo.
   * - Otherwise, go to Suggested Recipes screen with the photo.
   */
  const navigateToCertainScreen = () => {
    if (previousScreen === 'Log Meal') {
      navigation.navigate('Log Meal', { photo });
    } else if (previousScreen === 'Add Recipe') {
      navigation.navigate('Add Recipe', { photo });
    } else {
      navigation.navigate('Suggested Recipes', { photo });
    }
  };

  return (
    <View style={globalStyles.mainView}>
      {/* Display the photo preview */}
      {console.log('Photo received:', photo.uri)}
      <Image
        style={styles.image}
        source={{ uri: photo.uri }}
      />
      
      {/* Action buttons: Retake / Use Photo */}
      <View style={styles.buttonSection}>
        {/* Retake button — returns to previous camera screen */}
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: globalStyles.colors.background },
            { marginBottom: insets.bottom }
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={globalStyles.headerText2}>Retake</Text>
        </TouchableOpacity>

        {/* Use Photo button — navigates based on previous screen */}
        <TouchableOpacity
          style={[styles.button, { marginBottom: insets.bottom }]}
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
