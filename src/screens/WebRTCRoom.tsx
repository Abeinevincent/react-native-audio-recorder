import {View} from 'react-native';
import React from 'react';
import IconContainer from '../components/socketcomponents/IconContainer';
import {RTCView} from 'react-native-webrtc';
import EndCall from '../components/socketcomponents/EndCall';
import MicOn from '../components/socketcomponents/MicOn';
import MicOff from '../components/socketcomponents/MicOff';
import VideoOn from '../components/socketcomponents/VideoOn';
import VideoOff from '../components/socketcomponents/VideoOff';
import CameraSwitch from '../components/socketcomponents/CameraSwitch';

const WebRTCRoom = ({
  localStream,
  remoteStream,
  leave,
  otherUserId,
  switchCamera,
  toggleCamera,
  setlocalStream,
  setRemoteStream,
  localMicOn,
  toggleMic,
  localWebcamOn,
}: any) => {
  console.log(localStream, 'local stream in room');
  console.log(remoteStream, 'remote stream in room');

  console.log(localStream?.toURL(), 'Local Stream URL');
  console.log(remoteStream?.toURL(), 'Remote Stream URL');

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#050A0E',
        paddingHorizontal: 12,
        paddingVertical: 12,
        width: '100%',
        height: '100%',
      }}>
      {localStream ? (
        <RTCView
          objectFit={'cover'}
          style={{width: 200, height: 150, backgroundColor: '#050A0E'}}
          streamURL={localStream?.toURL()} // Updated here
        />
      ) : null}
      {remoteStream && (
        <RTCView
          mirror={true}
          objectFit={'cover'}
          style={{
            flex: 1,
            backgroundColor: '#050A0E',
            marginTop: 8,
          }}
          streamURL={remoteStream?.toURL()} // Updated here
          zOrder={0}
        />
      )}
      <View
        style={{
          marginVertical: 12,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}>
        <IconContainer
          backgroundColor={'red'}
          onPress={() => {
            leave();
            setlocalStream(null);
            setRemoteStream(null);
            otherUserId.current = null;
          }}
          Icon={() => {
            return <EndCall height={26} width={26} fill="#FFF" />;
          }}
        />
        <IconContainer
          style={{
            borderWidth: 1.5,
            borderColor: '#2B3034',
          }}
          backgroundColor={!localMicOn ? '#fff' : 'transparent'}
          onPress={() => {
            toggleMic();
          }}
          Icon={() => {
            return localMicOn ? (
              <MicOn height={24} width={24} fill="#FFF" />
            ) : (
              <MicOff height={28} width={28} fill="#1D2939" />
            );
          }}
        />
        <IconContainer
          style={{
            borderWidth: 1.5,
            borderColor: '#2B3034',
          }}
          backgroundColor={!localWebcamOn ? '#fff' : 'transparent'}
          onPress={() => {
            toggleCamera();
          }}
          Icon={() => {
            return localWebcamOn ? (
              <VideoOn height={24} width={24} fill="#FFF" />
            ) : (
              <VideoOff height={36} width={36} fill="#1D2939" />
            );
          }}
        />
        <IconContainer
          style={{
            borderWidth: 1.5,
            borderColor: '#2B3034',
          }}
          backgroundColor={'transparent'}
          onPress={() => {
            switchCamera();
          }}
          Icon={() => {
            return <CameraSwitch height={24} width={24} fill="#FFF" />;
          }}
        />
      </View>
    </View>
  );
};

export default WebRTCRoom;
