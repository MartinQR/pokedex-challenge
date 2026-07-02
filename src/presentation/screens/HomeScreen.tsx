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
import { TYPE_CONFIG } from "../constans/typeConfig";
import { useHomeViewModel } from "../hooks/useHomeViewModel";
import { NavigationProps } from "../navigation/types";
export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProps<"Home">>();

  const { pokemons, isLoading, error, refetch, isFetchingMore, fetchNextPage } =
    useHomeViewModel();

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
        <Text style={styles.errorText}>
          {error} || No se pudieron cargar los Pokémon. Por favor, verifica tu
          conexión.
        </Text>
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

  const renderItem = ({ item }: { item: Pokemon }) => {
    const mainType = item.types[0] || "default";
    const config = TYPE_CONFIG[mainType] || TYPE_CONFIG.default;

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: config.color }]}
        onPress={() =>
          navigation.navigate("Detail", {
            pokemonId: item.id,
          })
        }
      >
        <Text style={styles.pokemonId}>
          #{item.id.toString().padStart(3, "0")}
        </Text>

        <Image
          source={{ uri: item.imageUrl }}
          style={styles.pokemonImage}
          resizeMode="contain"
        />

        <Text style={styles.pokemonName}>
          {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
        </Text>

        <View style={[styles.typeBadge, { backgroundColor: "#ffffff90" }]}>
          <Text style={[styles.typeText, { color: config.textColor }]}>
            {config.emoji}{" "}
            {mainType.charAt(0).toUpperCase() + mainType.slice(1)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerData}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerSubtitle}>WELCOME TO THE</Text>
          <Text style={styles.headerTitle}>Pokedex Challenge</Text>
        </View>
        <FlatList
          data={pokemons}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          onEndReached={fetchNextPage}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingMore ? (
              <ActivityIndicator
                size="large"
                color="#ef5350"
                style={{ marginVertical: 15 }}
              />
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Estilos para el titulo

  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 28,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "rgba(0, 0, 0, 0.35)",
    letterSpacing: 2,
    marginBottom: 4,
    textAlign: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#1A2530",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  containerData: {
    flex: 1,
    padding: 12,
    paddingBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },

  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 50,
  },
  card: {
    flex: 1,
    margin: 8,
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  pokemonId: {
    position: "absolute",
    top: 10,
    left: 14,
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(0, 0, 0, 0.25)",
  },
  pokemonImage: {
    width: 95,
    height: 95,
    marginTop: 2,
  },
  pokemonName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2C3E50",
    textAlign: "center",
    marginBottom: 3,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  typeText: {
    fontSize: 11,
    fontWeight: "600",
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
