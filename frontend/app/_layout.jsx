import { router, SplashScreen, Stack, Tabs, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { Colors } from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";
import { Image, Text, View, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuth0, Auth0Provider } from "react-native-auth0";

// import GlobalProvider from "../context/GlobalProvider";

const TabIcon = ({ Icon, color, name, focused }) => {
  return (
    <View className="flex items-center justify-center">
      {/* <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      /> */}
      {Icon ? <Icon /> : <></>}
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const {authorize, clearSession, user, error, isLoading} = useAuth0();

  const [fontsLoaded, fontsError] = useFonts({
    "Montserrat-Black": require("../assets/fonts/Montserrat-Black.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-ExtraBold": require("../assets/fonts/Montserrat-ExtraBold.ttf"),
    "Montserrat-ExtraLight": require("../assets/fonts/Montserrat-ExtraLight.ttf"),
    "Montserrat-Light": require("../assets/fonts/Montserrat-Light.ttf"),
    "Montserrat-Medium": require("../assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-SemiBold": require("../assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Thin": require("../assets/fonts/Montserrat-Thin.ttf"),
  });

  const isDarkMode = false;
  const router = useRouter();

  useEffect(() => {
    if (fontsError) throw fontsError;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontsError]);

  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded && !fontsError) {
    return null;
  }

  return (
  <Auth0Provider domain={"dev-1jps85kh7htbmqki.us.auth0.com"} clientId={"zC8VQhr63IKYAxFgodyCQYgytnFmV6V3"}>
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: isDarkMode
            ? Colors.dark.primary
            : Colors.light.primary,
          tabBarInactiveTintColor: isDarkMode
            ? Colors.dark.gray[100]
            : Colors.light.gray[100],
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: isDarkMode
              ? Colors.dark.black.DEFAULT
              : Colors.light.gray[200],
            borderTopWidth: 1,
            borderTopColor: Colors.dark.secondary.DEFAULT,
            height: 80,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "PlayVu",
            headerShown: true,
            headerStyle: {
              backgroundColor: Colors.light.gray[200],
            },
            headerTintColor: "#ffffff",
            headerRight: () => (
              <Button
                title="Sign Out"
                color={Colors.dark.secondary.DEFAULT}
                onPress={onLogout}
              />
            ),
            headerTintColor: "#2C2C2C",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                color={color}
                name="PlayVu"
                focused={focused}
                Icon={() => (
                  <FontAwesome name="soccer-ball-o" size={24} color={color} />
                )}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                color={color}
                name="Home"
                focused={focused}
                Icon={() => <Entypo name="home" size={24} color={color} />}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerStyle: {
              backgroundColor: Colors.light.background,
            },
            headerTintColor: Colors.dark.black.DEFAULT,
            headerRight: () => (
              <View className="mr-2">
                <MaterialIcons
                  name="settings"
                  size={30}
                  color={Colors.light.primary}
                />
              </View>
            ),
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                color={color}
                name="Profile"
                focused={focused}
                Icon={() => (
                  <MaterialIcons
                    name="account-circle"
                    size={24}
                    color={color}
                  />
                )}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="(auth)"
          options={{
            title: "auth",
            headerShown: false,
            tabBarStyle: { display: "none" },
            tabBarItemStyle: { display: "none" },
          }}
        />

        <Tabs.Screen
          name="game/[query]"
          options={{
            title: "game",
            headerShown: false,
            tabBarStyle: { display: "none" },
            tabBarItemStyle: { display: "none" },
          }}
        />
      </Tabs>

      <StatusBar
        backgroundColor={
          isDarkMode ? Colors.dark.black.DEFAULT : Colors.light.black.DEFAULT
        }
        style={isDarkMode ? "dark" : "light"}
      />
    
  </>
  </Auth0Provider>
  );
};

export default RootLayout;
