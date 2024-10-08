import { StatusBar } from "expo-status-bar";
import { Text, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

// import { images } from "../constants";
// import { CustomButton, Loader } from "../components";
// import { useGlobalContext } from "../context/GlobalProvider";

const Welcome = () => {
  //   const { loading, isLogged } = useGlobalContext();

  //   if (!loading && isLogged) return <Redirect href="/home" />;
  const router = useRouter();

  return (
    <SafeAreaView className="bg-primary h-full">
      <Text className="text-2xl font-pbold text-black text-center">
        Welcome Page!
      </Text>

      <Button
        title="Go to Tabs"
        onPress={() => {
          router.push("(tabs)/home");
        }}
      />

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Welcome;
