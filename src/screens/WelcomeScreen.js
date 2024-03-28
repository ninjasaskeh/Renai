import {View, Text, Image, Touchable, TouchableOpacity} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';

export default function WelcomeScreen() {
  const navigation = useNavigation();
  return (
    <SafeAreaView className="flex-1 flex justify-around">
      <View className="space-y-2">
        <Text
          style={{fontSize: wp(10)}}
          className="text-center  font-bold text-gray-700">
          Renai
        </Text>
        <Text
          style={{fontSize: wp(4)}}
          className="text-center tracking-wider text-gray-600 font-semibold">
          Here's Come The AI
        </Text>
      </View>
      <View className="flex-row justify-center">
        <Image
          source={require('../../assets/images/robot.png')}
          style={{width: wp(75), height: wp(75)}}
        />
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        className="bg-[#84c3f4] mx-5 p-4 rounded-2xl">
        <Text
          style={{fontSize: wp(4.5)}}
          className="text-center font-bold text-white">
          Get Started
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
