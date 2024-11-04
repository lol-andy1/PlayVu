import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import {View, Text, Image, ScrollView, Alert} from "react-native";
import CustomButton from "../../components/CustomButton";
import Feather from "@expo/vector-icons/Feather";
import FootballField from "react-native-football-lineup";
import AppHeader from "../../components/AppHeader";

var home = {
  name: "POR",
  module: "4-4-2",
  team: [
    [
      {
        number: 1,
        name: "Patricio",
      },
    ],
    [
      {
        number: 21,
        name: "Soares",
      },
      {
        number: 3,
        name: "Pepe",
      },
      {
        number: 6,
        name: "Fonte",
      },
      {
        number: 5,
        name: "Guerriero",
      },
    ],
    [
      {
        number: 14,
        name: "Calvalho",
      },
      {
        number: 8,
        name: "Mountinho",
      },
      {
        number: 11,
        name: "Silva",
      },
      {
        number: 17,
        name: "Guedes",
      },
    ],
    [
      {
        number: 16,
        name: "Fernandes",
      },
      {
        number: 7,
        name: "Cristiano Ronaldo",
      },
    ],
  ],
  home_team_events: [
    {
      id: 203,
      type_of_event: "red-card",
      player: "Silva",
      time: "3'",
    },
    {
      id: 210,
      type_of_event: "yellow-card",
      player: "Fernandes",
      time: "64'",
    },
    {
      id: 210,
      type_of_event: "yellow-card",
      player: "Fonte",
      time: "64'",
    },
    {
      id: 206,
      type_of_event: "substitution-in",
      player: "Fonte",
      time: "31'",
    },
  ],
};

var away = {
  name: "SPA",
  module: "4-2-3-1",
  team: [
    [
      {
        number: 1,
        name: "De Gea",
      },
    ],
    [
      {
        number: 18,
        name: "Alba",
      },
      {
        number: 15,
        name: "Ramos",
      },
      {
        number: 3,
        name: "Pique",
      },
      {
        number: 4,
        name: "Nacho",
      },
    ],
    [
      {
        number: 8,
        name: "Koke",
      },
      {
        number: 5,
        name: "Busquets",
      },
    ],
    [
      {
        number: 6,
        name: "Iniesta",
      },
      {
        number: 22,
        name: "Isco",
      },
      {
        number: 21,
        name: "Silva",
      },
    ],
    [
      {
        number: 19,
        name: "Costa",
      },
    ],
  ],
  away_team_events: [
    {
      id: 210,
      type_of_event: "yellow-card",
      player: "De Gea",
      time: "12'",
    },
    {
      id: 206,
      type_of_event: "substitution-in",
      player: "Iniesta",
      time: "31'",
    },
    {
      id: 206,
      type_of_event: "substitution-in",
      player: "Costa",
      time: "32'",
    },
    {
      id: 206,
      type_of_event: "red-card",
      player: "Silva",
      time: "31'",
    },
  ],
};

const Search = () => {
  const { query } = useLocalSearchParams();
  const router = useRouter();
  //   const { data: posts, refetch } = useAppwrite(() => searchPosts(query));

  //   useEffect(() => {
  //     refetch();
  //   }, [query]);
  const gameData = {
    "startTime": new Date(2024, 9, 25, 10, 30, 0),
    "maxPlayers": 22
  }
  const currPlayerCount = home.team.reduce((len, arr) => len + arr.length, 0) 
    + away.team.reduce((len, arr) => len + arr.length, 0)

  return (
    <View className="bg-white h-full">
      <AppHeader 
        title={`Game ${query}`}
        leftComp={
          <CustomButton
            title={<Feather name="arrow-left" size={25} />}
            handlePress={() => router.back()}
            textStyles={"text-black"}
            containerStyles="w-12"
          />
        }
      />

      <StatusBar className="z-50"style="black" />

      <ScrollView className="w-full h-full flex">
        <Image
          source={{ uri: `https://picsum.photos/800/200?random=${query}` }}
          className="w-full h-40"
        />

        <View className="px-4 flex-row justify-between">
          <Text className="text-center text-sm text-black">{gameData.startTime.toLocaleString()}</Text>
          <Text className="text-center text-sm text-black">Price: ${query}</Text>
        </View>
        
        <View className="flex px-4 flex-row justify-between items-center">
        <Text className="text-lg font-semibold">Roster</Text>
          <Text className="text-sm text-black">
            Players: {currPlayerCount}/{gameData.maxPlayers}
          </Text>
        </View>

        <View className="bg-slate-300">
          <FootballField home={home} away={away} />
        </View>

      </ScrollView>
      <View className="absolute bottom-3 right-3">
        <CustomButton
          title="Join"
          handlePress={() => Alert.alert("Joined", `game in Field ${query}`)}
          containerStyles="bg-success mt-4 w-20 "
        />
      </View>

    </View>
  );
};

export default Search;
