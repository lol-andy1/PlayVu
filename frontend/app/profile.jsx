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
import { useAuth0 } from "react-native-auth0";

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
  if(!user) {
    onLogin();
  }
  // const { user, setUser, setIsLogged } = useGlobalContext();
  // const { data: posts } = useAppwrite(() => getUserPosts(user.$id));

  // const logout = async () => {
  //   await signOut();
  //   setUser(null);
  //   setIsLogged(false);

  //   router.replace("/sign-in");
  // };

  return (
    <SafeAreaView className="bg-black h-full">
      <StatusBar backgroundColor="#161622" style="light" />
      <ScrollView className="w-full">
        <View className="items-center p-5">
          <Image
            source={{ uri: playuser.profilePicture }}
            className="w-32 h-32 rounded-full border-2 border-gray-500 shadow-lg"
          />

          <Text className="text-white font-psemibold text-xl mt-4">
            {user.name}
          </Text>
          <Text className="text-gray-400 text-base">@{user.name}</Text>
          <Text className="text-gray-400 text-base mt-2">{user.email}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
