import { StatusBar } from "expo-status-bar";
import { Redirect, Tabs } from "expo-router";
import { Image, Text, View, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// import { icons } from "../../constants";
// import { Loader } from "../../components";
// import { useGlobalContext } from "../../context/GlobalProvider";
import { Colors } from "../../constants/Colors";

const TabIcon = ({ Icon, color, name, focused }) => {
  return (
    <View className="flex items-center justify-center gap-2">
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

const TabLayout = () => {
  // const { loading, isLogged } = useGlobalContext();

  // if (!loading && !isLogged) return <Redirect href="/sign-in" />;
  const isDarkMode = false;

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
              : Colors.light.black.DEFAULT,
            borderTopWidth: 1,
            borderTopColor: isDarkMode
              ? Colors.dark.secondary[100]
              : Colors.light.secondary[100],
            height: 84,
          },
        }}
      >
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
            headerShown: false,
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
      </Tabs>

      <StatusBar
        backgroundColor={
          isDarkMode ? Colors.dark.black.DEFAULT : Colors.light.black.DEFAULT
        }
        style={isDarkMode ? "light" : "dark"}
      />
    </>
  );
};

export default TabLayout;
