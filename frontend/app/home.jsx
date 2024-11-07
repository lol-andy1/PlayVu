import { View, Text, Button, ScrollView, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import GameCard from "../components/GameCard";
import { useState } from "react";

const Home = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView className="bg-white h-full">
      <TextInput
        className="bg-gray-300 text-black p-3 rounded border border-secondary shadow-md font-psemibold text-bases w-full"
        placeholder="Search games"
        placeholderTextColor="#2C2C2C"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          marginBottom: 20,
        }}
      />
      <ScrollView className="w-full">
        <View className="items-center">
          {filteredGames.map((game, index) => (
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
    </SafeAreaView>
  );
};

export default Home;
