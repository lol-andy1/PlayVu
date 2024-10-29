import { View, Text, Button } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const Home = () => {
  const router = useRouter();
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-xl font-bold">Home</Text>
      <Button title="Go to Back" onPress={() => router.back()} />
    </View>
  );
};

export default Home;
