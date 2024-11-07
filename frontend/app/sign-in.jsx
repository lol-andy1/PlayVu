import { useState } from "react";
import { Link, useRouter, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Alert,
  Image,
  Button,
  StyleSheet,
} from "react-native";
import CustomButton from "../components/CustomButton";
import FormField from "../components/FormField";
import Feather from "@expo/vector-icons/Feather";
import { useAuth0, Auth0Provider } from "react-native-auth0";
// import { useGlobalContext } from "../../context/GlobalProvider";

const Auth = () => {
  const {authorize, clearSession, user, error, isLoading} = useAuth0();

  const onLogin = async() => {
    try {
      await authorize();
      router.replace('/');
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
    return <View style={styles.container}><Text>Loading</Text></View>;
  }

  const loggedIn = user != undefined && user != null;

  return (
    <View style={styles.container}>
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
        <Auth />
        </View>
      </ScrollView>
    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});

export default SignIn;
