// import {View, Text} from 'react-native';
// import React, {useEffect, useRef, useState} from 'react';
// import {
//   ScreenCapturePickerView,
//   RTCPeerConnection,
//   RTCIceCandidate,
//   RTCSessionDescription,
//   RTCView,
//   MediaStream,
//   MediaStreamTrack,
//   mediaDevices,
// } from 'react-native-webrtc';
// import InCallManager from 'react-native-incall-manager';
// import JoinScreen from './screens/JoinScreen';
// import IncomingCallScreen from './screens/IncomingCall';
// import OutgoingCallScreen from './screens/OutgoingCall';
// import WebRTCRoom from './screens/WebRTCRoom';

// const Main = ({socket, callerId}: {socket: any; callerId: any}) => {
//   // type for keeping track of screen to display
//   const [type, setType] = useState('JOIN');

//   // callee id(other user id)
//   const otherUserId = useRef(null);

//   // stream of a local user
//   const [localStream, setLocalStream] = useState<MediaStream | null>(null);

//   /* When a call is connected, the video stream from the receiver is appended to this state in the stream*/
//   const [remoteStream, setRemoteStream] = useState<MediaStream>(
//     new MediaStream(),
//   );

//   /* This creates an WebRTC Peer Connection, which will be used to set local/remote descriptions and offers. */
//   const peerConnection = useRef<any>(
//     new RTCPeerConnection({
//       iceServers: [
//         {
//           urls: 'stun:stun.l.google.com:19302',
//         },
//       ],
//     }),
//   );

//   let remoteRTCMessage = useRef<any>(null);

//   // Receive new call from socket(initiated by caller)  ****************************
//   // This is a callee/receiver that gets this event(newCall) from socket server
//   // (signaling server)
//   socket?.on('newCall', (data: any) => {
//     /* This event occurs whenever any peer wishes to establish a call with you. */
//     remoteRTCMessage.current = data.rtcMessage;
//     otherUserId.current = data.callerId;
//     setType('INCOMING_CALL');
//   });

//   // Receiver/calee picks the call ***********************************
//   // Connection is established

//   socket?.on('callAnswered', async (data: any) => {
//     // 1. Remove any existing ICE candidate event listener
//     peerConnection.current.removeEventListener(
//       'icecandidate',
//       handleIceCandidate,
//     );
//     remoteRTCMessage.current = data.rtcMessage;

//     try {
//       // Check if peerConnection.current exists and has a remote description
//       if (
//         peerConnection.current &&
//         peerConnection.current.signalingState === 'have-local-offer'
//       ) {
//         // Set remote description received from Initial Callee
//         await peerConnection.current.setRemoteDescription(
//           new RTCSessionDescription(remoteRTCMessage.current),
//         );

//         // Continue with the rest of the WebRTC setup
//         setType('WEBRTC_ROOM');
//       } else {
//         console.warn(
//           'Remote description is already set or signaling state is incorrect.',
//         );
//       }
//       console.log(peerConnection.current, 'peer conn current');
//       // Log SDP information
//       console.log('Callee SDP (Answer):', remoteRTCMessage.current.sdp);

//       // Add ICE candidate event listener after setting remote description
//       // await peerConnection.current.addEventListener(
//       //   'icecandidate',
//       //   handleIceCandidate,
//       // );
//     } catch (error) {
//       console.log('Error setting remote description: rrrr', error);
//     }
//   });

//   socket?.on('ICEcandidate', (data: any) => {
//     console.log(
//       'Received ICE candidate data:',
//       data.rtcMessage,
//       'ice canddidate data from backened',
//     );

//     // Check for null values before creating RTCIceCandidate
//     try {
//       if (
//         data.rtcMessage?.label !== null &&
//         data.rtcMessage?.id !== null &&
//         data.rtcMessage?.candidate !== null
//       ) {
//         const iceCandidate = new RTCIceCandidate({
//           sdpMLineIndex: data.rtcMessage?.label,
//           sdpMid: data.rtcMessage?.id,
//           candidate: data.rtcMessage?.candidate,
//         });

//         // Check if peerConnection.current is available
//         if (peerConnection.current) {
//           console.log(
//             'Peer connection state:',
//             peerConnection.current.connectionState,
//           );
//           console.log(
//             'Remote description:',
//             peerConnection.current.remoteDescription,
//           );

//           // if (peerConnection.current.remoteDescription) {
//           // Remote description is set, add ICE candidate
//           peerConnection.current
//             .addIceCandidate(iceCandidate)
//             .then(() => {
//               console.log('ICE candidate added successfully.');
//             })
//             .catch((error: any) => {
//               console.error('Error adding ICE candidate:', error);
//             });
//           // } else {
//           //   console.warn('Remote description is not set yet.');
//           // }
//         } else {
//           console.error('Peer connection is not available.');
//         }
//       } else {
//         console.error('Invalid ICE candidate data:', data.rtcMessage);
//       }
//     } catch (err) {
//       console.log('Error receiving ice candidates', err);
//     }
//   });

//   useEffect(() => {
//     let isFront = false;

//     /*The MediaDevices interface allows you to access connected media inputs such as cameras and microphones. We ask the user for permission to access those media inputs by invoking the mediaDevices.getUserMedia() method. */
//     mediaDevices.enumerateDevices().then((sourceInfos: any) => {
//       let videoSourceId;
//       for (let i = 0; i < sourceInfos.length; i++) {
//         const sourceInfo = sourceInfos[i];
//         if (
//           sourceInfo.kind == 'videoinput' &&
//           sourceInfo.facing == (isFront ? 'user' : 'environment')
//         ) {
//           videoSourceId = sourceInfo.deviceId;
//         }
//       }

//       mediaDevices
//         .getUserMedia({
//           audio: true,
//           video: {
//             mandatory: {
//               minWidth: 500, // Provide your own width, height and frame rate here
//               minHeight: 300,
//               minFrameRate: 30,
//             },
//             facingMode: isFront ? 'user' : 'environment',
//             optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
//           },
//         })
//         .then(stream => {
//           // Get local stream!
//           console.log(stream, 'local stream');
//           setLocalStream(stream);

//           // setup stream listening
//           // peerConnection.current.addStream(stream);
//           stream.getTracks().forEach((track: any) => {
//             console.log(track, 'tract');
//             peerConnection.current.addTrack(track, stream);
//             console.log(peerConnection, 'peer conn');
//           });
//         })
//         .catch(error => {
//           console.log(error, 'error getting user media');
//         });
//     });

//     peerConnection.current.ontrack = (event: any) => {
//       event?.streams[0]?.getTracks().forEach((track: any) => {
//         if (remoteStream) {
//           remoteStream.addTrack(track);
//         } else {
//           console.warn('Remote stream not available when adding track');
//         }
//       });

// if (event.streams && event?.streams[0]) {
//   setRemoteStream(event?.streams[0]);
// } else {
//   console.warn('Event.streams not yet available');
// }
//     };
//   }, [type, remoteStream]);

//   useEffect(() => {
//     // Setup ice handling
//     peerConnection.current.onicecandidate = (event: any) => {
//       if (event.candidate) {
//         // Send the ICE candidate to the other peer via your signaling server
//         socket?.emit('iceCandidate', {
//           calleeId: otherUserId.current,
//           callerId,
//           rtcMessage: {
//             label: event.candidate.sdpMLineIndex,
//             id: event.candidate.sdpMid,
//             candidate: event.candidate.candidate,
//           },
//         });
//       } else {
//         console.log('End of candidates.');
//       }
//     };
//   }, []);

//   // INITIATE A NEW CALL(CALLER SENDS IT TO SOCKET THEN SOCKET SENDS TO CALLEE)
//   async function processCall() {
//     // 1. Remove any existing ICE candidate event listener
//     peerConnection.current.removeEventListener(
//       'icecandidate',
//       handleIceCandidate,
//     );

//     // 1. Alice runs the `createOffer` method for getting SDP.
//     const sessionDescription = await peerConnection.current.createOffer();

//     // 2. Alice sets the local description using `setLocalDescription`.
//     await peerConnection.current.setLocalDescription(sessionDescription);

//     // 4. Add tracks after setting local description
//     console.log(peerConnection.current, 'peer conn currenton');

//     // 4. Add ICE candidate event listener after setting local description
//     // peerConnection.current.addEventListener('icecandidate', handleIceCandidate);

//     // Log SDP information
//     console.log('Caller SDP (Offer):', sessionDescription.sdp);

//     // 3. Send this session description to Bob using socket?.io
//     socket?.emit('call', {
//       callerId,
//       calleeId: otherUserId.current,
//       rtcMessage: sessionDescription,
//     });
//   }

//   // ANSWER CALL FROM SOCKET(BY CALLEE)
//   async function processAccept() {
//     // Ensure that remoteRTCMessage.current is set
//     if (remoteRTCMessage.current) {
//       // 4. Bob sets the description, Alice sent him as the remote description using `setRemoteDescription()`
//       await peerConnection.current.setRemoteDescription(
//         new RTCSessionDescription(remoteRTCMessage.current),
//       );

//       // 5. Bob runs the `createAnswer` method
//       const sessionDescription = await peerConnection.current.createAnswer();

//       // 6. Bob sets that as the local description and sends it to Alice
//       await peerConnection.current.setLocalDescription(sessionDescription);

//       socket?.emit('answerCall', {
//         callerId: otherUserId.current,
//         rtcMessage: sessionDescription,
//       });
//     }
//   }

//   // ICE candidate event handler
//   async function handleIceCandidate(event: any) {
//     console.log('ICE candidate event:', event);
//     if (event.candidate) {
//       // Send the ice candidate to the callee
//       await socket?.emit('iceCandidate', {
//         callerId,
//         calleeId: otherUserId.current,
//         iceCandidate: event.candidate,
//       });
//     }
//   }

//   // Handling Mic status
//   const [localMicOn, setlocalMicOn] = useState(true);

//   // Handling Camera status
//   const [localWebcamOn, setlocalWebcamOn] = useState(true);

//   // Switch Camera
//   function switchCamera() {
//     localStream?.getVideoTracks().forEach((track: any) => {
//       track._switchCamera();
//     });
//   }

//   // Enable/Disable Camera
//   function toggleCamera() {
//     localWebcamOn ? setlocalWebcamOn(false) : setlocalWebcamOn(true);
//     localStream?.getVideoTracks().forEach((track: any) => {
//       localWebcamOn ? (track.enabled = false) : (track.enabled = true);
//     });
//   }

//   // Enable/Disable Mic
//   function toggleMic() {
//     localMicOn ? setlocalMicOn(false) : setlocalMicOn(true);
//     localStream?.getAudioTracks().forEach((track: any) => {
//       localMicOn ? (track.enabled = false) : (track.enabled = true);
//     });
//   }

//   // Destroy WebRTC Connection
//   function leave() {
//     peerConnection.current.close();
//     setLocalStream(null);
//     setType('JOIN');
//   }

//   useEffect(() => {
//     InCallManager.start();
//     InCallManager.setKeepScreenOn(true);
//     InCallManager.setForceSpeakerphoneOn(true);

//     return () => {
//       InCallManager.stop();
//     };
//   }, []);

//   return (
//     <View
//       style={{
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         width: '100%',
//         height: '100%',
//       }}>
//       {type === 'JOIN' && (
//         <JoinScreen
//           socket={socket}
//           callerId={callerId}
//           otherUserId={otherUserId}
//           type={type}
//           setType={setType}
//           processCall={processCall}
//         />
//       )}
//       {type === 'INCOMING_CALL' && (
//         <IncomingCallScreen
//           setType={setType}
//           processAccept={processAccept}
//           otherUserId={otherUserId}
//         />
//       )}
//       {type === 'OUTGOING_CALL' && (
//         <OutgoingCallScreen setType={setType} otherUserId={otherUserId} />
//       )}
//       {type === 'WEBRTC_ROOM' && (
//         <WebRTCRoom
//           localStream={localStream}
//           otherUserId={otherUserId}
//           leave={leave}
//           remoteStream={remoteStream}
//           switchCamera={switchCamera}
//           toggleCamera={toggleCamera}
//           setlocalStream={setLocalStream}
//           setRemoteStream={setRemoteStream}
//           localMicOn={localMicOn}
//           toggleMic={toggleMic}
//           localWebcamOn={localWebcamOn}
//         />
//       )}
//     </View>
//   );
// };

// export default Main;

import React, {useRef} from 'react';

import {
  Button,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  mediaDevices,
} from 'react-native-webrtc';
import {useState} from 'react';

import firestore from '@react-native-firebase/firestore';

const Main = ({callerId, socket}: any) => {
  const [remoteStream, setRemoteStream] = useState<any>(null);
  const [webcamStarted, setWebcamStarted] = useState(false);
  const [localStream, setLocalStream] = useState<any>(null);
  const [channelId, setChannelId] = useState<any>(null);
  const pc = useRef<any>();
  const servers = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };

  // Function to check if a track with the same ID exists in the peer connection
  function isTrackAlreadyAdded(trackId: any, peerConnection: any) {
    const senders = peerConnection.getSenders();
    return senders.some(
      (sender: any) => sender.track && sender.track.id === trackId,
    );
  }

  const startWebcam = async () => {
    pc.current = new RTCPeerConnection(servers);
    const local = await mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    local.getTracks().forEach(track => {
      // pc.current.addTrack(track, local);
      if (!isTrackAlreadyAdded(track.id, pc.current)) {
        const sender = pc.current.addTrack(track, local);
        console.log(sender);
      } else {
        console.log('Track is already added to the peer connection.');
      }
    });

    setLocalStream(local);
    const remote = new MediaStream();
    setRemoteStream(remote);

    // Push tracks from local stream to peer connection
    // local.getTracks().forEach(track => {
    //   const sender = pc.current.addTrack(track, local);
    //   console.log(sender);
    // });

    // Pull tracks from remote stream, add to video stream
    pc.current.ontrack = (event: any) => {
      event.streams[0].getTracks().forEach((track: any) => {
        remote.addTrack(track);
      });
      if (event.streams && event?.streams[0]) {
        console.log(event.streams, 'event.streams');
        setRemoteStream(event?.streams[0]);
      } else {
        console.warn('Event.streams not yet available');
      }
    };

    // pc.current.ontrack = (event: any) => {
    //   event.streams[0].getTracks().forEach((track: any) => {
    //     remote.addTrack(track);
    //   });
    // };

    setWebcamStarted(true);
  };

  const startCall = async () => {
    const channelDoc = firestore().collection('channels').doc();
    const offerCandidates = channelDoc.collection('offerCandidates');
    const answerCandidates = channelDoc.collection('answerCandidates');

    setChannelId(channelDoc.id);

    pc.current.onicecandidate = async (event: any) => {
      console.log(event, 'event on ice candidate');
      if (event.candidate) {
        await offerCandidates.add(event.candidate.toJSON());
      }
    };

    //create offer
    const offerDescription = await pc.current.createOffer();
    await pc.current.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await channelDoc.set({offer});

    // Listen for remote answer
    channelDoc.onSnapshot(async snapshot => {
      const data = snapshot.data();
      if (!pc.current.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        if (answerDescription) {
          await pc.current.setRemoteDescription(
            new RTCSessionDescription(answerDescription),
          );
        }
      } else {
        console.log('SOmething went worng, remote dec not set');
      }
    });

    // When answered, add candidate to peer connection
    answerCandidates.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const data = change.doc.data();
          pc.current.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  };

  const joinCall = async () => {
    const channelDoc = firestore().collection('channels').doc(channelId);
    const offerCandidates = channelDoc.collection('offerCandidates');
    const answerCandidates = channelDoc.collection('answerCandidates');

    pc.current.onicecandidate = async (event: any) => {
      if (event.candidate) {
        await answerCandidates.add(event.candidate.toJSON());
      }
    };

    const channelDocument = await channelDoc.get();
    const channelData = channelDocument.data();

    const offerDescription = channelData?.offer;

    try {
      if (offerDescription) {
        await pc.current.setRemoteDescription(
          new RTCSessionDescription(offerDescription),
        );
      }

      const answerDescription = await pc.current.createAnswer();
      await pc.current.setLocalDescription(answerDescription);
      const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
      };

      await channelDoc.update({answer});
    } catch (err) {
      console.log(err, 'didnt set remote desc');
    }

    offerCandidates.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const data = change.doc.data();
          pc.current.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  };

  // console.log(localStream, 'local stream');
  // console.log(localStream?.toURL(), 'local stream');

  console.log(remoteStream, 'remote stream');

  // console.log(remoteStream?.toURL(), 'remote stream');

  return (
    <KeyboardAvoidingView style={styles.body} behavior="position">
      <SafeAreaView>
        {localStream && (
          <RTCView
            streamURL={localStream?.toURL()}
            style={styles.stream}
            objectFit="cover"
            mirror
          />
        )}

        {remoteStream && (
          <RTCView
            streamURL={remoteStream?.toURL()}
            style={styles.stream}
            objectFit="cover"
            mirror
          />
        )}
        <View style={styles.buttons}>
          {!webcamStarted && (
            <Button title="Start webcam" onPress={startWebcam} />
          )}
          {webcamStarted && <Button title="Start call" onPress={startCall} />}
          {webcamStarted && (
            <View style={{flexDirection: 'row'}}>
              <Button title="Join call" onPress={joinCall} />
              <TextInput
                value={channelId}
                placeholder="callId"
                // minLength={45}
                style={{borderWidth: 1, color: 'black', padding: 5}}
                onChangeText={newText => setChannelId(newText)}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#fff',

    justifyContent: 'center',
    alignItems: 'center',
    // ...StyleSheet.absoluteFill,
  },
  stream: {
    flex: 2,
    width: 200,
    height: 200,
  },
  buttons: {
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
});

export default Main;
