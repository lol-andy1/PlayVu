import { useRouter } from "expo-router";
import { Pressable, View, Image, Text } from "react-native";
import { Colors } from "../constants/Colors";
const GameCard = ({ id, name, price, duration, location, date }) => {
  const router = useRouter();
  return (
    <Pressable onPress={() => router.push(`/game/${id}`)}>
      <View style={{backgroundColor: Colors.light.gray[200]}} className="bg-black m-4 rounded-lg p-4 w-80">
        <Text className="text-lg font-bold mt-2">{name}</Text>
        <Text className="text-lg text-base">{duration}</Text>
        <Text className="text-lg text-base">{location}</Text>
        <Text className="text-lg text-base">{date}</Text>
        <Text className="text-lg text-gray-500 ml-auto mr-2">Price: ${price}</Text>
      </View>
    </Pressable>
  );
};

export default GameCard;