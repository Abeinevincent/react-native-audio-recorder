import React, {useEffect, useState} from 'react';
import {View, Text, Button, Alert} from 'react-native';
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVModeIOSOption,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
} from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import SoundPlayer from 'react-native-sound-player';
import useAudioPermissions from './src/hooks/useAudioPermissions';
import RecordAudioComponent from './src/components/audio/RecordAudioComponent';

// interface AudioSet {
//   AVSampleRateKeyIOS?: number;
//   AVFormatIDKeyIOS?: AVEncodingType;
//   AVModeIOS?: AVModeType;
//   AVNumberOfChannelsKeyIOS?: number;
//   AVEncoderAudioQualityKeyIOS?: AVEncoderAudioQualityIOSType;
//   AudioSourceAndroid?: AudioSourceAndroidType;
//   OutputFormatAndroid?: OutputFormatAndroidType;
//   AudioEncoderAndroid?: AudioEncoderAndroidType;
// }

const App = () => {
  const permissionsGranted = useAudioPermissions();

  useEffect(() => {
    if (permissionsGranted === null) {
      // Permissions are still being checked
    } else if (permissionsGranted) {
      // Permissions are granted, proceed with your app logic
    } else {
      // Permissions are not granted, handle accordingly
      Alert.alert(
        'Permissions Not Granted',
        'Please grant the necessary permissions to use this app.',
        [{text: 'OK', onPress: () => {}}], // Add any additional action if needed
      );
    }
  }, [permissionsGranted]);

  const [isRecording, setIsRecording] = useState(false);
  const [audioPath, setAudioPath] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [startCountDown, setStartCountdown] = useState(false);

  // Feel free to add more states if you want to party!

  const generateAudioName = () => {
    return `Audio ${Math.floor(Math.random() * 900000) + 100000}`;
    // Come up with a funky way to generate a name here!
  };
  const startRecording = async () => {
    // Let's get creative and generate a unique audio name!

    const path = `${generateAudioName()}.aac`;
    // Set up the audio settings for our recording adventure
    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVModeIOS: AVModeIOSOption.measurement,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };

    const meteringEnabled = false;

    // Let the countdown begin…or not!
    await setCountdown(0);
    await setSeconds(0);
    await setMinutes(0);
    setStartCountdown(true);
    try {
      // Start the recording and get the audio URI
      // @ts-ignore
      const uri = await AudioRecorderPlayer?.current?.startRecorder(
        path,
        audioSet,
        meteringEnabled,
      );
      setIsRecording(true);
      // setAudio;
      setAudioPath(uri);
    } catch (error) {
      console.log('Uh-oh! Failed to start recording:', error);
    }
  };

  const stopRecording = async () => {
    setStartCountdown(false);
    try {
      // Stop the recording and see what we've got
      // @ts-ignores
      const result = await AudioRecorderPlayer?.current?.stopRecorder();
      setIsRecording(false);
    } catch (error) {
      console.log('Oops! Failed to stop recording:', error);
    }
  };

  // const prepRecording = async () => {
  //   setStartCountdown(false);
  //   try {
  //     // Stop the recording (for real this time)
  //     // @ts-ignore
  //     const result = await AudioRecorderPlayer?.current?.stopRecorder();
  //     const fileContent = await RNFS.readFile(audioPath, 'base64');
  //     const fileInfo = await RNFS.stat(audioPath);
  //     const vnData = {
  //       fileCopyUri: fileInfo?.path,
  //       size: fileInfo?.size,
  //       type: 'audio/mpeg',
  //       name: `${generateAudioName()}.${getFileType(fileInfo?.path)}`,
  //     };
  //     const vnBase = `data:application/audio;base64,${fileContent}`;
  //     setAudioFile(vnData);
  //     setAudioBase(vnBase);
  //     // Now input code here to send your voicenote to websocket endpoint.
  //     setIsRecording(false);
  //   } catch (error) {
  //     console.log('Uh-oh! Failed to stop and send recording:', error);
  //   }
  // };

  // const playAudio = async (newAudioUrl: string) => {
  //   if (active === newAudioUrl) {
  //     try {
  //       if (isPlaying) {
  //         await SoundPlayer.pause(); // Pause the audio if already playing
  //         setIsPlaying(false);
  //       } else {
  //         await SoundPlayer.resume(); // Resume playing the audio if paused
  //         setIsPlaying(true);
  //       }
  //     } catch (error) {
  //       console.log(
  //         'Oh no! An error occurred while pausing/resuming audio:',
  //         error,
  //       );
  //     }
  //   } else {
  //     try {
  //       if (isPlaying) {
  //         await SoundPlayer.stop(); // Stop the currently playing audio
  //       }
  //       dispatch(setPlaying(newAudioUrl)); // Set the new audio URL
  //       setIsPlaying(true);
  //       const soundData = await SoundPlayer.getInfo();
  //       setTotalDuration(soundData?.duration);
  //       SoundPlayer.addEventListener('FinishedPlaying', () => {
  //         setIsPlaying(false); // Reset the playing state when audio finishes playing
  //         dispatch(clearPlaying(newAudioUrl));
  //       });
  //       await SoundPlayer.playUrl(newAudioUrl); // Play the new audio
  //       const audio = await SoundPlayer.getInfo();
  //       setTotalDuration(audio?.duration);
  //     } catch (error) {
  //       console.log('Oops! An error occurred while playing audio:', error);
  //     }
  //   }
  // };

  return (
    <View>
      <RecordAudioComponent />
    </View>
  );
};

export default App;
