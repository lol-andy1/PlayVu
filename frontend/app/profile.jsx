import { router } from "expo-router";
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

// import { icons } from "../../constants";
// import useAppwrite from "../../lib/useAppwrite";
// import { getUserPosts, signOut } from "../../lib/appwrite";
// import { useGlobalContext } from "../../context/GlobalProvider";
// import { EmptyState, InfoBox, VideoCard } from "../../components";

const Profile = () => {
  // const { user, setUser, setIsLogged } = useGlobalContext();
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
    bio: "I like playing soccor",
    profilePicture: "https://randomuser.me/api/portraits/men/32.jpg",
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <StatusBar backgroundColor="#161622" style="light" />
      <ScrollView className="w-full">
        <View className="items-center p-5">
          <Image
            source={{ uri: user.profilePicture }}
            className="w-32 h-32 rounded-full border-2 border-gray-500 shadow-lg"
          />

          <Text className="text-black font-psemibold text-xl mt-4">
            {user.name}
          </Text>
          <Text className="text-gray-400 text-base">@{user.username}</Text>
          <Text className="text-gray-400 text-base mt-2">{user.email}</Text>
          <Text className="text-gray-400 text-base mt-4 text-center">
            {user.bio}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
