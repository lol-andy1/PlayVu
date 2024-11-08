import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Auth0Provider } from "react-native-auth0";

// import { Loader } from "../../components";
// import { useGlobalContext } from "../../context/GlobalProvider";

const AuthLayout = () => {
  //   const { loading, isLogged } = useGlobalContext();

  //   if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <Auth0Provider domain={"dev-1jps85kh7htbmqki.us.auth0.com"} clientId={"zC8VQhr63IKYAxFgodyCQYgytnFmV6V3"}>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </Auth0Provider>
  );
};

export default AuthLayout;
