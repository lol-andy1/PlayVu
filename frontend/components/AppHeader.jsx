import React, { useState } from 'react';
import {Modal, View, Image, TouchableOpacity, ScrollView, Text, TextInput,
} from "react-native";

const AppHeader = (({leftComp, title, rightComp}) => {

  return (
    <View className="bg-gray-200  border-b border-gray-100 px-2 pt-12 h-24 w-full flex-row justify-between items-center">
      <View className="flex-1 flex-row justify-start">
        {leftComp}
      </View>

      <Text className="text-center font-semibold text-xl">
        {title}
      </Text>

      <View className="flex-1 flex-row justify-end">
        {rightComp}
      </View>

    </View>
  );
});

export default AppHeader