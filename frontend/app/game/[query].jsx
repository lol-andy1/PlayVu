import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import {View, Text, Image, ScrollView, Alert} from "react-native";
import { useEffect, useState } from "react";
import axios from "axios"
import CustomButton from "../../components/CustomButton";
import Feather from "@expo/vector-icons/Feather";
import FootballField from "react-native-football-lineup";
import AppHeader from "../../components/AppHeader";

const Search = () => {

  const homeFormation = "4-3-3"
  const [homePlayers, setHomePlayers] = useState([])
  const awayFormation = "4-3-3"
  const [awayPlayers, setAwayPlayers] = useState([])

  const home = {  
    name: "SPA",
    module: homeFormation,
    team: homePlayers,
    home_team_events: []
  }

  const away = {  
    name: "FRA",
    module: awayFormation,
    team: awayPlayers,
    away_team_events: []
  }

  const [gameName, setGameName] = useState("")
  const [startDate, setStartDate] = useState(new Date(""))
  const [price, setPrice] = useState(0)

  const setPositions = (players, formation, flag) => {
    formation = "1-" + formation
    formation = formation.split("-").map(Number)
    team = []
    let playerIndex = 0
    
    formation.forEach((count, index) => {
      team[index] = []
      for (let i = 0; i < count; i++){
        if (playerIndex < players.length){
          team[index].push({number: playerIndex, name: players[playerIndex]})
          playerIndex++
        }
      }
    });

    if (flag){
      setAwayPlayers(team)
    }
    else{
      setHomePlayers(team)
    }
  }

  const { query } = useLocalSearchParams();

  useEffect(() => {
    const getGameData = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/get-game-data',{
          params: {
            gameId: query
          }
        })
        console.log(res.data)

        setPositions(res.data.team_1, homeFormation, false)
        setPositions(res.data.team_2, awayFormation, true)

        setGameName(res.data.name)
        setStartDate(new Date(res.data.start_date))
        setPrice(res.data.price)

      } catch(err) {
        console.error(err);
      }
    }

    getGameData()
  }, [query]) 

  const router = useRouter();

  const currPlayerCount = home.team.reduce((len, arr) => len + arr.length, 0) 
    + away.team.reduce((len, arr) => len + arr.length, 0)

  return (
    <View className="bg-white h-full">
      <AppHeader 
        title={gameName}
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
          <Text className="text-center text-sm text-black">{startDate.toLocaleString()}</Text>
          <Text className="text-center text-sm text-black">Price: ${price}</Text>
        </View>
        
        <View className="flex px-4 flex-row justify-between items-center">
        <Text className="text-lg font-semibold">Roster</Text>
          <Text className="text-sm text-black">
            Players: {currPlayerCount}/{22}
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
