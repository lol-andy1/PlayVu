import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  StyleSheet,
  Alert,
} from "react-native";
import CustomButton from "../../components/CustomButton";
import Feather from "@expo/vector-icons/Feather";
import FootballField from "react-native-football-lineup";
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

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4"
          style={{
            minHeight: Dimensions.get("window").height - 400,
          }}
        >
          <CustomButton
            title={<Feather name="arrow-left" size={25} />}
            handlePress={() => router.back()}
            containerStyles="absolute top-5 left-5 px-2 py-0.5 max-h-10 max-w-10"
          />
          <Image
            source={{ uri: `https://picsum.photos/200/300?random=${query}` }}
            className="w-full h-40 rounded-lg mt-28"
          />
          <Text className="text-lg text-black font-bold mt-2">
            Field {query}
          </Text>
          <Text className="text-sm text-gray-500">Price: ${query}</Text>

          <View className="mt-4">
            <FootballField home={home} away={away} />
          </View>
          <CustomButton
            title="Join"
            handlePress={() => Alert.alert("Joined", `game in Field ${query}`)}
            containerStyles="mt-4 max-h-10 max-w-10"
          />
        </View>
        <StatusBar backgroundColor="#161622" style="auto" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Search;
