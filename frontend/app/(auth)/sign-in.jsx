import { useState } from "react";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Alert,
  Image,
  Button,
} from "react-native";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import Feather from "@expo/vector-icons/Feather";
import { useAuth0, Auth0Provider } from "react-native-auth0";
// import { useGlobalContext } from "../../context/GlobalProvider";

const Auth = () => {
  const {authorize, clearSession, user, error, isLoading} = useAuth0();

  const onLogin = async() => {
    try {
      await authorize();
    }
    catch (e) {
      console.log(e);
    }
  };

  const onLogout = async () => {
    try {
      await clearSession();
    } catch (e) {
      console.log('Log out cancelled');
    }
  };

  if (isLoading) {
    return <View><Text>Loading</Text></View>;
  }

  const loggedIn = user != undefined && user != null;

  return (
    <View>
    {loggedIn && <Text>You are logged in as {user.name}</Text>}
    {!loggedIn && <Text>You are not logged in</Text>}
    {error && <Text>{error.message}</Text>}

    <Button
      onPress={loggedIn ? onLogout : onLogin}
      title={loggedIn ? 'Log Out' : 'Log In'}
    />
  </View>
  );
}

const SignIn = () => {
  const router = useRouter();
  return (
    <SafeAreaView className="bg-black h-full">

      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <CustomButton
            title={<Feather name="arrow-left" size={25} />}
            handlePress={() => router.back()}
            containerStyles="absolute top-5 left-5 px-2 py-0.5 max-h-10 max-w-10"
          />      
        <Auth0Provider domain={"dev-1jps85kh7htbmqki.us.auth0.com"} clientId={"3AuqTtm3vGKzgR8EC8EgWpAFKluGjLyp"}>
          <Auth />
        </Auth0Provider>
        </View>
      </ScrollView>
    </SafeAreaView>
    
  );
};

export default SignIn;
