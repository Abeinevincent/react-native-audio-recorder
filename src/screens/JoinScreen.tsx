import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import React from 'react';
import TextInputContainer from '../components/socketcomponents/TextInput';

const JoinScreen = ({callerId, otherUserId, setType, processCall}: any) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#050A0E',
        justifyContent: 'center',
      }}>
      <View
        style={{
          padding: 35,
          backgroundColor: '#1A1C22',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 14,
        }}>
        <Text
          style={{
            fontSize: 18,
            color: '#D0D4DD',
          }}>
          Your Caller ID
        </Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 12,
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 32,
              color: '#ffff',
              letterSpacing: 6,
            }}>
            {callerId}
          </Text>
        </View>
      </View>

      <View
        style={{
          backgroundColor: '#1A1C22',
          padding: 40,
          marginTop: 25,
          justifyContent: 'center',
          borderRadius: 14,
        }}>
        <Text
          style={{
            fontSize: 18,
            color: '#D0D4DD',
          }}>
          Enter call id of another user
        </Text>
        <TextInputContainer
          placeholder={'Enter Caller ID'}
          value={otherUserId.current}
          setValue={(text: any) => {
            otherUserId.current = text;
          }}
          keyboardType={'number-pad'}
        />
        <TouchableOpacity
          onPress={() => {
            processCall();
            setType('OUTGOING_CALL');
          }}
          style={{
            height: 50,
            backgroundColor: '#5568FE',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 12,
            marginTop: 16,
          }}>
          <Text
            style={{
              fontSize: 16,
              color: '#FFFFFF',
            }}>
            Call Now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default JoinScreen;
