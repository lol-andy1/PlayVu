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
import AppHeader from "../components/AppHeader";

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
      name: "Field 1",
      price: 20,
      image: "https://picsum.photos/200/300?random=1",
    },
    {
      name: "Field 2",
      price: 15,
      image: "https://picsum.photos/200/300?random=2",
    },
    {
      name: "Field 3",
      price: 25,
      image: "https://picsum.photos/200/300?random=3",
    },
    {
      name: "Field 4",
      price: 18,
      image: "https://picsum.photos/200/300?random=4",
    },
    {
      name: "Field 5",
      price: 22,
      image: "https://picsum.photos/200/300?random=5",
    },
  ];

  return (
    <View className="bg-white h-full">
      <AppHeader
        title="PlayVu"
        rightComp={
          <Button
            title="Sign In"
            color={Colors.dark.secondary.DEFAULT}
            onPress={() => router.push("(auth)/sign-in")}
          />
        }
      />

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
              image={game.image}
            />
          ))}
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="auto" />
    </View>
  );
};

export default Welcome;
