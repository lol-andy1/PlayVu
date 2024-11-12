import { StatusBar } from "expo-status-bar";
import {
  Text,
  Button,
  View,
  Dimensions,
  Link,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Tabs } from "expo-router";
import CustomButton from "../components/CustomButton";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "../constants/Colors";
import GameCard from "../components/GameCard";

// import { images } from "../constants";
// import { CustomButton, Loader } from "../components";
// import { useGlobalContext } from "../context/GlobalProvider";

const Welcome = () => {
  //   const { loading, isLogged } = useGlobalContext();

  //   if (!loading && isLogged) return <Redirect href="/home" />;
  const router = useRouter();
  const isDarkMode = false;

  const games = [
    {
      duration: "00:50:00",
      name: "Game 4",
      location: "Location 49",
      date: new Date("2024-10-28T16:59:56.346+00:00"),
      price: 5
    },
    {
      duration: "00:08:00",
      name: "Game 9",
      location: "Location 49",
      date: new Date("2024-11-17T17:59:56.875+00:00"),
      price: 10
    },
    {
      duration: "00:16:00",
      name: "Game 41",
      location: "Location 49",
      date: new Date("2024-11-13T18:00:00.134+00:00"),
      price: 5
    },
  ];

  return (
    <SafeAreaView className="bg-white h-full">
      <Text className="text-xl text-center text-white font-bold mb-3">
        Click to join!
      </Text>
      <ScrollView className="w-full">
        <View className="items-center">
          {games.map((game, index) => (
            <GameCard
              key={index}
              id={index}
              name={game.name}
              price={game.price}
              duration={game.duration}
              date={game.date.toLocaleString()}
            />
          ))}
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="auto" />
    </SafeAreaView>
  );
};

export default Welcome;
