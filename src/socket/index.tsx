import {StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {io} from 'socket.io-client';
import LiveKitMain from './livekitsrc/screenss/LiveKitMain';

const App = () => {
  const socket = useRef<any>();
  const [rid, setRid] = useState('');
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState<any>([]);
  const [onlineusers, setOnlineUsers] = useState([]);
  useEffect(() => {
    socket.current = io('http://192.168.82.2:3000');
    socket.current?.on('getMessage', (messageDetails: any) => {
      console.log(messageDetails);
      setMessages((prev: any) => [
        ...prev,
        {senderId: messageDetails.senderId, text: messageDetails.text},
      ]);
    });
    socket.current.on('connect', () => {
      console.log('device connected');
    });
    socket.current.on('disconnect', () => console.log('user disconnected'));
  }, []);

  const genUserId = () => {
    return Math.floor(100000 + Math.random() * 700000).toString();
  };

  const [uid] = useState(genUserId());

  useEffect(() => {
    socket.current?.emit('addUser', uid);
    socket.current?.on('getUsers', (users: any) => {
      setOnlineUsers(users);
      console.log(users);
    });
  }, []);

  const sendMessage = () => {
    // setMessages((prev: any) => [...prev, {senderId: uid, text: msg}]);
    socket.current.emit('sendMessage', {
      senderId: uid,
      receiverId: rid,
      text: msg,
    });
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      }}>
      {/* <Text>App</Text>
      <Text>{uid}</Text>
      {onlineusers?.map((user: any, index: any) => (
        <View key={index}>
          <Text>{user.userId}</Text>
          <Text>{user.socketId}</Text>
        </View>
      ))}

      {messages?.map((msg: any, index: any) => (
        <View key={index}>
          <Text>{msg.senderId}</Text>
          <Text>{msg.text}</Text>
        </View>
      ))}

      <View style={{padding: 20, gap: 10}}>
        <TextInput
          placeholder="Enter text.."
          value={msg}
          onChangeText={val => setMsg(val)}
          style={{borderColor: 'black', borderWidth: 1}}
        />
        <TextInput
          placeholder="Enter receiver id.."
          value={rid}
          onChangeText={val => setRid(val)}
          style={{borderColor: 'black', borderWidth: 1}}
        />
        <Button onPress={sendMessage} title="Send Message" />
      </View> */}

      {/* <Main callerId={uid} socket={socket.current} /> */}
      <LiveKitMain />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({});
