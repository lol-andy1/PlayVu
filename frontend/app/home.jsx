import { View, Text, Button, ScrollView, TextInput, Pressable, } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import GameCard from "../components/GameCard";
import { useState, useEffect } from "react";
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
const LOCATION_TASK_NAME = 'background-location-task';
const requestPermissions = async () => {
  const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus === 'granted') {
    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus === 'granted') {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 1000,
        distanceInterval: 1,
      });
    }
  }
};

const Home = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const games = [];

  const [filterKey, setFilterKey] = useState("name"); // Default filter by "name"

  const filterKeys = ["name", "duration", "price", "date"];

  const filteredGames = games.filter((game) =>
    game[filterKey]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [location, setLocation] = useState(null);
  useEffect(() => {
    TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
      if (error) {
        console.error(error);
        return;
      }
      if (data) {
        const { locations } = data;
        if (locations.length) {
          setLocation(locations[0].coords);
        }
      }
    });
  }, []);  

  const getGames = async () => {
    try {
      const res = await axios.get('https://playvubackend.icysand-c7acd929.eastus.azurecontainerapps.io/api/get-games?latitude=40.0379&longitude=-73.471&distance=100');
    
      const gamesList = res.data;
  
      // Map over the games list to process each game
      gamesList.map(game => {
        games.push({
          duration: game.duration,
          name: game.name,
          date: game.start_date,
          price: game.price
        });
      });
      
      return gamesList;  
    } catch (err) {
      console.error(err);
    }
  };

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
      <View>
      <Text>Welcome!</Text>
      <Button onPress={requestPermissions} title="Enable background location" />
      {location && (
        <Text>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </Text>
      )}
    </View>
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
              date={game.date.toLocaleString([], {
                month: "long",
                day: "numeric", 
                hour: '2-digit', 
                minute:'2-digit'
              })}
            />
          ))}
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="auto" />
    </SafeAreaView>
  );
};

export default Home;
