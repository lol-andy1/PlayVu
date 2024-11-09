import { useRouter } from "expo-router";
import { Pressable, View, Image, Text } from "react-native";
import { Colors } from "../constants/Colors";
const GameCard = ({ id, name, price, image }) => {
  const router = useRouter();
  return (
    <Pressable onPress={() => router.push(`/game/${id}`)}>
      <View style={{backgroundColor: Colors.light.gray[200]}} className="bg-black m-4 rounded-lg p-4 w-80">
        <Image source={{ uri: image }} className="w-full h-40 rounded-lg" />
        <Text className="text-lg font-bold mt-2">{name}</Text>
        <Text className="text-sm text-gray-500">Price: ${price}</Text>
      </View>
    </Pressable>
  );
};

export default GameCard;
