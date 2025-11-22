import { useState, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import globalStyles from '../utils/globalStyles';

// This screen shows what the camera sees, a flip button to swap the front and back phone cameras, and a take photo button.
export default function CameraScreen({ navigation, route }) {
  const { previousScreen } = route.params;
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  const insets = useSafeAreaInsets();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={[globalStyles.mainView, styles.permissionSection]}>
        <Text style={[styles.permissionMessage, globalStyles.headerText2]}>We need your permission to show the camera</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={[styles.permissionButtonText, globalStyles.headerText2]}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // This allows the user to select which camera to use, the front or the back.
  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  // Take a photo and go to the preview screen.
  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        // Photo taken will be a string representation of the image (base 64 encoding).
        const photo = await cameraRef.current.takePictureAsync({ base64: true });
        navigation.navigate('Camera Preview', { previousScreen, photo });
      } catch (e) {
        console.error('Error taking photo:', e);
      }
    }
  };

  return (
    <View style={styles.cameraSection}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} />

      <View style={[styles.cameraButtonSection, { paddingBottom: insets.bottom*2 }]}>
        <TouchableOpacity style={styles.flipCameraButton} onPress={toggleCameraFacing}>
          <Text style={[globalStyles.headerText, styles.text]}>Flip</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
          <Ionicons name="camera" size={30} color={globalStyles.colors.background} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  permissionMessage: {
    textAlign: 'center',
    paddingBottom: globalStyles.sectionValues.sectionPadding,
  },
  permissionSection: {
    justifyContent: 'center',
    padding: globalStyles.sectionValues.sectionPadding,
  },
  permissionButton: {
    backgroundColor: globalStyles.colors.primary,
    borderWidth: globalStyles.buttonValues.buttonBorderWidth,
    borderRadius: globalStyles.buttonValues.buttonBorderRadius,
    paddingVertical: globalStyles.buttonValues.buttonPadding,
    paddingHorizontal: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraSection: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraButtonSection: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  flipCameraButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: globalStyles.sectionValues.sectionPadding,
    borderRadius: globalStyles.buttonValues.buttonBorderRadius*1.5,
  },
  captureButton: {
    padding: globalStyles.buttonValues.buttonPadding*2,
    borderWidth: globalStyles.buttonValues.buttonBorderWidth,
    borderColor: globalStyles.colors.background,
    borderRadius: globalStyles.buttonValues.buttonBorderRadius*1.5,
  },
  text: {
    color: globalStyles.colors.background,
  },
});
