import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Text,
  Button,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAuth0 } from "react-native-auth0";
import FontAwesome from '@expo/vector-icons/FontAwesome';
// import { icons } from "../../constants";
// import useAppwrite from "../../lib/useAppwrite";
// import { getUserPosts, signOut } from "../../lib/appwrite";
// import { useGlobalContext } from "../../context/GlobalProvider";
// import { EmptyState, InfoBox, VideoCard } from "../../components";

const Profile = () => {
  const {authorize, clearSession, user, error, isLoading} = useAuth0();
  const onLogin = async () => {
    try {
      await authorize();
    } catch (e) {
      console.log(e);
    }
  };
  const onLogout = async () => {
    try {
      await clearSession();
    } catch (e) {
      console.log('Log out cancelled');
      console.log(e);
    }
  };
  if(!user) {
    onLogin();
  }
  // const { user, setUser, setIsLogged } = useGlobalContext();
  //const { user, setUser, setIsLogged } = useGlobalContext();
  // const { data: posts } = useAppwrite(() => getUserPosts(user.$id));

  // const logout = async () => {
  //   await signOut();
  //   setUser(null);
  //   setIsLogged(false);

  //   router.replace("/sign-in");
  // };

  const playuser = {
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

  return (
    <>
      <StatusBar backgroundColor="#161622" style="dark" />

      <ScrollView className="w-full p-4 bg-grey-100">
        <View className="flex-row w-full">
          <Image
            source={{ uri: playuser.profilePicture }}
            className="w-32 h-32 rounded-full border-2 border-gray-500 shadow-lg"
          />
          <View className="flex-1 px-2">
            <Text className="text-black font-psemibold text-2xl mt-2">
              {user.name}
            </Text>

            <Text className="text-gray-100 text-base mt-2">
              @{user.email}
            </Text>

            <Text className="text-gray-100 text-base mt-2">
              {playuser.bio}
            </Text>
            <Button
                title="Log Out"
                color={Colors.dark.secondary.DEFAULT}
                onPress={onLogout}
              />
          </View>
        </View>

        <View className="items-center w-full mt-5">
          <Text className="w-full text-center py-2 text-black text-lg font-bold">Recent Games</Text>

          {recentGames.map(item => (
            <View className="bg-primary items-center flex-row w-full p-1 mt-2 rounded-md h-16" key={item.gameId}>
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
