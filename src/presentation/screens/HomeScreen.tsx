import { useNavigation } from "@react-navigation/native";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pokemon } from "../../domain/entities/Pokemon";
import { useHomeViewModel } from "../hooks/useHomeViewModel";
import { NavigationProps } from "../navigation/types";

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProps<"Home">>();

  const { pokemons, isLoading, error, refetch } = useHomeViewModel();

  // Estado de Carga
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#ef5350" />
        <Text style={styles.loadingText}>Cargando Pokedex...</Text>
      </View>
    );
  }

  // Estado de Error
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Reintentar" onPress={refetch} color="#ef5350" />
      </View>
    );
  }

  // Estado Vacío
  if (pokemons.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No se encontraron Pokémon.</Text>
      </View>
    );
  }

  // Renderizador de cada tarjeta de Pokémon
  const renderItem = ({ item }: { item: Pokemon }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("Detail", {
          pokemonId: item.id,
          pokemonName: item.name,
        })
      }
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.pokemonImage}
        resizeMode="contain"
      />
      <Text style={styles.pokemonName}>
        #{item.id} {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Pokédex Challenge</Text>
      <FlatList
        data={pokemons}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        numColumns={2}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
    color: "#333",
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 8,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pokemonImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
    textAlign: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#d32f2f",
    textAlign: "center",
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});
