import {useEffect, useState} from 'react';
import {PermissionsAndroid, Alert} from 'react-native';

const useAudioPermissions = () => {
  const [permissionsGranted, setPermissionsGranted] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);

        // Check if all permissions are granted
        const allPermissionsGranted = Object.values(granted).every(
          status => status === PermissionsAndroid.RESULTS.GRANTED,
        );

        setPermissionsGranted(allPermissionsGranted);

        if (!allPermissionsGranted) {
          // If any permission is not granted, show an alert to the user
          Alert.alert(
            'Permissions Required',
            'Please grant the necessary permissions to use this app.',
            [{text: 'OK', onPress: requestPermissions}],
          );
        }
      } catch (err) {
        console.error('Error while requesting permissions:', err);
        setPermissionsGranted(false);
      }
    };

    requestPermissions();
  }, []);

  return permissionsGranted;
};

export default useAudioPermissions;
