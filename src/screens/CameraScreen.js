import { useState, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import globalStyles from '../utils/globalStyles';

/**
 * This screen displays the device camera feed using Expo Camera.
 * It allows the user to:
 *  - Grant camera permissions if not already given.
 *  - Switch between front and back cameras.
 *  - Capture a photo.
 * 
 * Once a photo is taken, the screen navigates to CameraPreviewScreen,
 * passing the captured photo and information about which screen opened the camera.
 */
export default function CameraScreen({ navigation, route }) {
  const { previousScreen } = route.params;
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const insets = useSafeAreaInsets();

  // Handle permission loading state.
  if (!permission) {
    // Permissions are still loading (async).
    return <View />;
  }

  // Handle permission not yet granted.
  if (!permission.granted) {
    return (
      <View style={[globalStyles.mainView, styles.permissionSection]}>
        <Text style={[styles.permissionMessage, globalStyles.headerText2]}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={[styles.permissionButtonText, globalStyles.headerText2]}>
            Grant Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  /**
   * Toggles the camera between front and back.
   * Uses a ternary operator to swap the 'facing' state.
   */
  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  /**
   * Captures a still image using the active camera.
   * The resulting image data (photo object) includes URI and base64.
   * After taking the photo, navigates to the Camera Preview screen.
   */
  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        // Capture image (base64 encoding can be used for preview or upload).
        const photo = await cameraRef.current.takePictureAsync({ base64: true });

        // Navigate to preview screen and pass the captured photo.
        navigation.navigate('Camera Preview', { previousScreen, photo });
      } catch (e) {
        console.error('Error taking photo:', e);
      }
    }
  };

  return (
    <View style={styles.cameraSection}>
      {/* Displays the live camera feed */}
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} />

      {/* Bottom overlay with flip and capture buttons */}
      <View style={[styles.cameraButtonSection, { paddingBottom: insets.bottom * 2 }]}>
        {/* Flip camera button (front/back) */}
        <TouchableOpacity style={styles.flipCameraButton} onPress={toggleCameraFacing}>
          <Text style={[globalStyles.headerText, styles.text]}>Flip</Text>
        </TouchableOpacity>

        {/* Capture button (takes photo) */}
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
    borderRadius: globalStyles.buttonValues.buttonBorderRadius * 1.5,
  },
  captureButton: {
    padding: globalStyles.buttonValues.buttonPadding * 2,
    borderWidth: globalStyles.buttonValues.buttonBorderWidth,
    borderColor: globalStyles.colors.background,
    borderRadius: globalStyles.buttonValues.buttonBorderRadius * 1.5,
  },
  text: {
    color: globalStyles.colors.background,
  },
});
