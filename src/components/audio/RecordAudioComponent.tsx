// RecordAudioComponent.tsx
import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSet,
} from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import {Path, Svg} from 'react-native-svg';

const RecordAudioComponent: React.FC = () => {
  //   const audioRecorderPlayer = new AudioRecorderPlayer();
  //   const [isRecording, setIsRecording] = useState(false);
  const audioRecorderPlayer = new AudioRecorderPlayer();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedTime, setRecordedTime] = useState(0);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const path = RNFS.DocumentDirectoryPath + '/audio.mp3';

      const audioSet: AudioSet = {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: 0, // Default microphone source for Android
      };

      await audioRecorderPlayer.startRecorder(path, audioSet);
      setIsRecording(true);

      // Start the timer
      timerInterval.current = setInterval(() => {
        setRecordedTime(prevTime => prevTime + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      setIsRecording(false);

      // Stop the timer
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
        timerInterval.current = null;
      }

      console.log('Recording stopped. File path:', result);
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  return (
    <View>
      <Text>Record Audio Component</Text>

      <View>
        <TouchableOpacity
          onPress={isRecording ? stopRecording : startRecording}>
          <Svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            fill={isRecording ? 'red' : 'black'}>
            <Path d={isRecording ? 'M4 3h16v18H4z' : 'M12 3v18l-8.4-6H4z'} />
          </Svg>
        </TouchableOpacity>
        <Text>{isRecording ? 'Recording...' : 'Not Recording'}</Text>
        <Text>Duration: {recordedTime} seconds</Text>
      </View>
    </View>
  );
};

export default RecordAudioComponent;
