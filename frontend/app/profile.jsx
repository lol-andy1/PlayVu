import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Text,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import FontAwesome from '@expo/vector-icons/FontAwesome';
// import { icons } from "../../constants";
// import useAppwrite from "../../lib/useAppwrite";
// import { getUserPosts, signOut } from "../../lib/appwrite";
// import { useGlobalContext } from "../../context/GlobalProvider";
// import { EmptyState, InfoBox, VideoCard } from "../../components";

const Profile = () => {
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

  return (
    <>
      <StatusBar backgroundColor="#161622" style="light" />

      <ScrollView className="w-full p-4 bg-black">
        <View className="flex-row w-full">
          <Image
            source={{ uri: user.profilePicture }}
            className="w-32 h-32 rounded-full border-2 border-gray-500 shadow-lg"
          />

          <View className="flex-1 px-2">
            <Text className="text-white font-psemibold text-2xl mt-2">
              {user.name}
            </Text>

            <Text className="text-gray-400 text-base mt-2">
              @{user.username}
            </Text>

            <Text className="text-white text-base mt-2">
              {user.bio}
            </Text>
          </View>
        </View>

        <View className="items-center w-full mt-5">
          <Text className="w-full text-center py-2 text-white text-lg font-bold">Recent Games</Text>

          {recentGames.map(item => (
            <View className="bg-slate-700 items-center flex-row w-full p-1 mt-2 rounded-md h-16" key={item.gameId}>
              <View className="mx-2">
                <FontAwesome name="soccer-ball-o" size={30} color="white" />
              </View>

              <Text className="text-white text-base">
                {item.fieldName}
              </Text>
              
              <Text className="text-white text-base ml-auto mr-2">
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
