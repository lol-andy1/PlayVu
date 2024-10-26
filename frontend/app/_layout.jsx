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
  const [fontsLoaded, error] = useFonts({
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
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
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
            headerRight: () => (
              <Button
                title="Sign In"
                color={Colors.dark.secondary.DEFAULT}
                onPress={() => router.push("(auth)/sign-in")}
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
              backgroundColor: Colors.dark.background,
            },
            headerTintColor: "#fff",
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
  );
};

export default RootLayout;
