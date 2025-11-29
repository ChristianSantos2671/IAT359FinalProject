import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import globalStyles from '../utils/globalStyles';

export default function CameraPreviewScreen({ route, navigation }) {
  const { previousScreen, photo } = route.params;

  const insets = useSafeAreaInsets();

  const navigateToCertainScreen = () => {
    if (previousScreen === 'Log Meal') {
      navigation.navigate('Log Meal', { photo });
    } else if (previousScreen === 'Add Recipe') {
      navigation.navigate('Add Recipe', { photo });
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
          style={[globalStyles.secondaryButton, styles.button, {marginBottom: insets.bottom}]}
          onPress={() => navigation.goBack()}
        >
          <Text style={globalStyles.secondaryButtonText}>Retake</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[globalStyles.primaryButton, {marginBottom: insets.bottom}]}
          onPress={() => navigateToCertainScreen()}
        >
          <Text style={globalStyles.primaryButtonText}>Use Photo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // styling once photo has been taken
  image: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
  },

  // spacing for button section
  buttonSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: globalStyles.sectionValues.sectionPadding,
  },

});
