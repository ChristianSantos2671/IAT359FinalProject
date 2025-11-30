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
        <Text style={[styles.permissionMessage, globalStyles.h3]}>We need your permission to show the camera</Text>
        <TouchableOpacity
          style={[globalStyles.primaryButton, {flex:0}]}
          onPress={requestPermission}
        >
          <Text style={globalStyles.primaryButtonText}>Grant Permission</Text>
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
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} /> 

      <View style={[styles.cameraButtonSection, { paddingBottom: insets.bottom*2 }]}>
        <TouchableOpacity style={styles.cameraButton} onPress={toggleCameraFacing}>
          <Ionicons name="sync" size={30} color={globalStyles.colors.background} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.cameraButton} onPress={takePhoto}>
          <Ionicons name="camera" size={30} color={globalStyles.colors.background} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

// perm message styling
  permissionMessage: {
    textAlign: 'center',
    paddingBottom: globalStyles.sectionValues.sectionPadding,
  },

  // layout for permissions section
  permissionSection: {
    justifyContent: 'center',
    padding: globalStyles.sectionValues.sectionPadding,
  },

  // camera spacing
  cameraSection: {
    flex: 1,
  },

  camera: {
    flex: 1,
  },
  
  // layout for camera buttons
  cameraButtonSection: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },

  // styling for camera buttons
  cameraButton: {
    padding: globalStyles.buttonValues.buttonPadding*2,
    borderWidth: globalStyles.buttonValues.buttonBorderWidth,
    borderColor: globalStyles.colors.background,
    borderRadius: globalStyles.buttonValues.buttonBorderRadius * 1.5,
  },

});
