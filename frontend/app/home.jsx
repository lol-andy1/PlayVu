import { View, Text, Button, ScrollView, TextInput, Pressable } from "react-native";
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

  const [filterKey, setFilterKey] = useState("name"); // Default filter by "name"

  const filterKeys = ["name", "duration", "price", "date"];

  const filteredGames = games.filter((game) =>
    game[filterKey]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
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
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginVertical: 10 }}>Filter by:</Text>
      <View style={{ flexDirection: 'row' }}>
        {filterKeys.map((key) => (
          <Pressable
            key={key}
            onPress={() => setFilterKey(key)}
            style={{
              padding: 10,
              marginHorizontal: 5,
              backgroundColor: filterKey === key ? 'green' : 'gray',
              borderRadius: 5
            }}
          >
            <Text style={{ color: 'white' }}>{key}</Text>
          </Pressable>
        ))}
      </View>
      <ScrollView className="w-full">
        <View className="items-center">
          {filteredGames.map((game, index) => (
            <GameCard
              key={index}
              id={index}
              name={game.name}
              price={game.price}
              duration={game.duration}
              location={game.location}
              date={game.date.toLocaleString()}
            />
          ))}
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="auto" />
    </SafeAreaView>
  );
};

export default Home;
