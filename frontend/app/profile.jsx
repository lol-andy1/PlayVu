import React, { useState } from 'react';
import {Modal, View, Image, TouchableOpacity, ScrollView, Text, TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import FontAwesome from '@expo/vector-icons/FontAwesome';

import CustomButton from "../components/CustomButton";
import AppHeader from '../components/AppHeader';
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "@/constants/Colors";
// import { icons } from "../../constants";
// import useAppwrite from "../../lib/useAppwrite";
// import { getUserPosts, signOut } from "../../lib/appwrite";
// import { useGlobalContext } from "../../context/GlobalProvider";
// import { EmptyState, InfoBox, VideoCard } from "../../components";

const Profile = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const showModel = () => {
    setModalVisible(true)
  }
  //const { user, setUser, setIsLogged } = useGlobalContext();
  // const { data: posts } = useAppwrite(() => getUserPosts(user.$id));

  // const logout = async () => {
  //   await signOut();
  //   setUser(null);
  //   setIsLogged(false);

  //   router.replace("/sign-in");
  // };

  const user = {
    name: "John Doe",
    username: "john_doe",
    email: "johndoe@example.com",
    bio: "I like playing soccer",
    profilePicture: "https://randomuser.me/api/portraits/men/32.jpg",
  };

  const recentGames = [
    {
      "gameId": 1,
      "fieldName": "Penberthy",
      "startTime": new Date('2024-10-24T14:30:00')
    },
    {
      "gameId": 2,
      "fieldName": "Kyle Field",
      "startTime": new Date('2024-11-24T16:15:00')
    },
    {
      "gameId": 3,
      "fieldName": "Simpson",
      "startTime": new Date('2024-12-24T08:45:00')
    }
  ];

  const [name, setName] = useState(user.name)
  const [username, setUsername] = useState(user.username)
  const [bio, setBio] = useState(user.bio)


  return (
    <>
      <AppHeader 
        title = "Profile"
        rightComp={
          <TouchableOpacity onPress={showModel}>
            <MaterialIcons
              name="settings"
              size={30}
              color={Colors.light.gray[100]}
            />
          </TouchableOpacity>
        }
      />

      <StatusBar backgroundColor="#161622" style="dark" />

      <ScrollView className="w-full p-4 bg-white">
        <View className="flex-row w-full">
          <Image
            source={{ uri: user.profilePicture }}
            className="w-32 h-32 rounded-full border-2 border-gray-500 shadow-lg"
          />

          <View className="flex-1 px-2">
            <Text className="text-black font-psemibold text-2xl mt-2">
              {user.name}
            </Text>

            <Text className="text-gray-100 text-base mt-2">
              @{user.username}
            </Text>

            <Text className="text-gray-100 text-base mt-2">
              {user.bio}
            </Text>
          </View>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => showModel}
        >
          <View className="bg-white w-full h-full mt-12">
            <View className="flex-row justify-between w-full py-2 pr-2 border-b">
              <Text className="absolute w-full top-3 text-center font-semibold text-xl">
                Edit Profile
              </Text>

              <CustomButton
                title={<Feather name="arrow-left" size={25} />}
                handlePress={() => setModalVisible(false)}
                textStyles={"text-black"}
                containerStyles="w-12 z-50"
              />

              <CustomButton
                title="Save"
                textStyles={"text-black font-xs"}
                containerStyles="bg-success px-2"
              />
            </View>

            <View className="mt-4 px-4 space-y-4">
              <View className="flex-row items-center">
                <Text className="w-[50%] font-semibold">
                  Profile Picture:
                </Text>      
                <Image
                  source={{ uri: user.profilePicture }}
                  className="w-24 h-24 rounded-full border-2 border-gray-500 shadow-lg"
                />
              </View>

              <View className="flex-row items-center">
                <Text className="w-[50%] font-semibold">
                  Name:
                </Text>
                <TextInput
                  className="border border-gray-100 p-2 w-[50%] "
                  placeholder="Enter text here"
                  value={name}
                />
              </View>

              <View className="flex-row items-center">
                <Text className="w-[50%] font-semibold">
                  Username:
                </Text>
                <TextInput
                  className="border border-gray-100 p-2 w-[50%] "
                  placeholder="Enter text here"
                  value={username}
                />
              </View>

              <View className="flex-row items-center">
                <Text className="w-[50%] font-semibold">
                  Bio:
                </Text>
                <TextInput
                  className="border border-gray-100 p-2 w-[50%] "
                  placeholder="Enter text here"
                  value={bio}
                />
              </View>
            </View>
          </View>
        </Modal>

        <View className="items-center w-full mt-5">
          <Text className="w-full text-center py-2 text-black text-lg font-bold">Recent Games</Text>

          {recentGames.map(item => (
            <View className="bg-secondary-200 items-center flex-row w-full p-1 mt-2 rounded-md h-16" key={item.gameId}>
              <View className="mx-2">
                <FontAwesome name="soccer-ball-o" size={30} color="black" />
              </View>

              <Text className="text-black text-base">
                {item.fieldName}
              </Text>
              
              <Text className="text-gray-100 text-base ml-auto mr-2">
                {item.startTime.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
        
      </ScrollView>
    </>
  );
};

export default Profile;
