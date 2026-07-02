import { useNavigation } from "@react-navigation/native";
import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationProps } from "../navigation/types";

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProps<"Home">>();

  const handleNavigateToDetail = () => {
    navigation.navigate("Detail", { pokemonId: 25, pokemonName: "Pikachu" });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Pokedex - Home</Text>
        <Text style={styles.subtitle}>Listado inicial (Próximamente)</Text>
        <Button title="Go to Pikachu Detail" onPress={handleNavigateToDetail} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 20 },
});
