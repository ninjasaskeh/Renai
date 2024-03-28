import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {SafeAreaView} from 'react-native-safe-area-context';
import Features from '../components/features';
import {dummyMessages} from '../constants';
import Voice from '@react-native-voice/voice';
import {apiCall} from '../api/openAi';

export default function HomeScreen() {
  const [messages, setMessages] = useState(dummyMessages);
  const [recording, setRecording] = useState(false);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();

  const speechStartHandler = e => {
    console.log('Speech Start Handler');
  };
  const speechEndHandler = e => {
    setRecording(false);
    console.log('Speech End Handler');
  };
  const speechResultsHandler = e => {
    console.log('Voice results: ', e);
    const text = e.value[0];
    setResult(text);
  };

  const speechErrorHandler = e => {
    console.log('Speech Error: ', e);
  };

  const startRecording = async () => {
    setRecording(true);
    try {
      await Voice.start(`en`); //en-GB
    } catch (er) {
      console.log('error: ', er);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setRecording(false);
      // call fetch response()
      fetchResponse();
    } catch (er) {
      console.log('error: ', er);
    }
  };

  const fetchResponse = () => {
    if (result.trim().length > 0) {
      let newMessages = [...messages];
      newMessages.push({role: 'user', content: result.trim()});
      setMessages([...newMessages]);
      updateScrollView();
      setLoading(true);
      apiCall(result.trim(), newMessages).then(res => {
        // console.log('got api data: ', res);
        setLoading(false);
        if (res.success) {
          setMessages([...res.data]);
          updateScrollView();
          setResult('');
        } else {
          Alert.alert('Error', res.msg);
        }
      });
    }
  };

  const updateScrollView = () => {
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd({animated: true});
    }, 200);
  };

  const clear = () => {
    setMessages([]);
  };

  useEffect(() => {
    // voice handler event
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;
    Voice.onSpeechError = speechErrorHandler;

    return () => {
      // destroy the voice instance
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  // console.log('result: ', result);

  return (
    <View className="flex-row flex">
      <SafeAreaView className="flex-1 flex mx-5">
        {/* icon */}
        <View className="flex-row justify-center">
          <Image
            source={require('../../assets/images/robot.png')}
            style={{width: hp(15), height: hp(15)}}
          />
        </View>
        <Text
          style={{fontSize: wp(5)}}
          className="text-center font-semibold text-gray-700">
          - RENAI -
        </Text>
        {/* features || messages */}
        {messages.length > 0 ? (
          <View className="space-y-2">
            <Text
              style={{fontSize: wp(4)}}
              className="text-gray-700 flex ml-1 text-center">
              Assistant
            </Text>
            <View
              style={{height: hp(58)}}
              className="bg-neutral-200 rounded-3xl p-4">
              <ScrollView
                ref={scrollViewRef}
                bounces={false}
                className="space-y-4"
                showsVerticalScrollIndicator={false}>
                {messages.map((message, i) => {
                  if (message.role == 'assistant') {
                    if (message.content.includes('https')) {
                      // its imagae
                      return (
                        <View key={i} className="flex-row justify-start">
                          <View className="p-2 flex rounded-2xl bg-[#96dbf8] rounded-tl-none">
                            <Image
                              source={{uri: message.content}}
                              className="rounded-2xl"
                              resizeMode="contain"
                              style={{height: wp(60), width: wp(60)}}
                            />
                          </View>
                        </View>
                      );
                    } else {
                      //its text
                      return (
                        <View
                          key={i}
                          style={{width: wp(70)}}
                          className="bg-[#96dbf8] rounded-xl p-2 rounded-tl-none ">
                          <Text>{message.content}</Text>
                        </View>
                      );
                    }
                  } else {
                    // user input
                    return (
                      <View key={i} className="flex-row justify-end">
                        <View
                          style={{width: wp(70)}}
                          className="bg-white rounded-xl p-2 rounded-tr-none ">
                          <Text>{message.content}</Text>
                        </View>
                      </View>
                    );
                  }
                })}
              </ScrollView>
            </View>
          </View>
        ) : (
          <Features />
        )}

        {/* recording */}
        <View className="flex justify-center items-center mt-2">
          {loading ? (
            <Image
              source={require('../../assets/images/loading.gif')}
              style={{width: hp(6), height: hp(6)}}
            />
          ) : recording ? (
            // stop
            <TouchableOpacity
              onPress={stopRecording}
              className="bg-[#96dbf8] p-3 rounded-full">
              <Image
                className="rounded-full"
                source={require('../../assets/images/micoff.png')}
                style={{width: hp(4), height: hp(4)}}
              />
            </TouchableOpacity>
          ) : (
            // start
            <TouchableOpacity
              onPress={startRecording}
              className="bg-[#96dbf8] p-3 rounded-full">
              <Image
                className="rounded-full"
                source={require('../../assets/images/mic.png')}
                style={{width: hp(4), height: hp(4)}}
              />
            </TouchableOpacity>
          )}

          {/* clear button */}
          {messages.length > 0 && (
            <TouchableOpacity
              onPress={clear}
              className="bg-neutral-400 rounded-2xl py-2 px-4 absolute right-8">
              <Text className="text-white font-semibold">Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
