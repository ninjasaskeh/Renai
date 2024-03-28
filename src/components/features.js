import {View, Text, Image} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function Features() {
  return (
    <View style={{height: hp(60)}} className="space-y-2 flex">
      <Text style={{fontSize: wp(5)}} className="font-semibold text-gray-700">
        Hi, There
      </Text>
      <View className="bg-[#96dbf8] p-4 rounded-2xl space-y-2 rounded-tl-none">
        <Text style={{fontSize: wp(3.8)}} className="">
          My name is Renai, How can I help you, I am AI powered by chat gpt and
          dall-e.I can help you search for something and make you a picture. Are
          you curious?
        </Text>
      </View>
    </View>
  );
}
