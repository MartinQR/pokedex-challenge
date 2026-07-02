import { RouteProp, useRoute } from "@react-navigation/native";
import {
  ActivityIndicator,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDetailViewModel } from "../hooks/useDetailViewModel";
import { RootStackParamList } from "../navigation/types";

type DetailScreenRouteProp = RouteProp<RootStackParamList, "Detail">;

export const DetailScreen = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const { pokemonId } = route.params;

  const { pokemon, isLoading, error, refetch } = useDetailViewModel(pokemonId);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#ef5350" />
        <Text style={styles.infoText}>Cargando detalles...</Text>
      </View>
    );
  }

  if (error || !pokemon) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          {error || "Ocurrió un error inesperado"}
        </Text>
        <Button title="Reintentar" onPress={refetch} color="#ef5350" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>
          #{pokemon.id} {pokemon.name.toUpperCase()}
        </Text>

        <Image
          source={{ uri: pokemon.imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.row}>
          <View style={styles.badgeInfo}>
            <Text style={styles.badgeLabel}>Height</Text>
            <Text style={styles.badgeValue}>{pokemon.height / 10} m</Text>
          </View>
          <View style={styles.badgeInfo}>
            <Text style={styles.badgeLabel}>Weight</Text>
            <Text style={styles.badgeValue}>{pokemon.weight / 10} kg</Text>
          </View>
          <View style={styles.badgeInfo}>
            <Text style={styles.badgeLabel}>Base Exp</Text>
            <Text style={styles.badgeValue}>{pokemon.baseExperience}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Types</Text>
        <View style={styles.row}>
          {pokemon.types.map((type) => (
            <View
              key={type}
              style={[styles.typeBadge, { backgroundColor: "#4caf50" }]}
            >
              <Text style={styles.typeText}>{type.toUpperCase()}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Abilities</Text>
        <View style={styles.row}>
          {pokemon.abilities.map((ability) => (
            <View key={ability} style={styles.abilityBadge}>
              <Text style={styles.abilityText}>{ability}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Base Stats</Text>
        <View style={styles.statsContainer}>
          {pokemon.stats.map((stat) => (
            <View key={stat.name} style={styles.statRow}>
              <Text style={styles.statName}>{stat.name.toUpperCase()}</Text>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.statBar,
                    { width: `${Math.min(stat.value, 100)}%` },
                  ]}
                />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { padding: 35, alignItems: "center" },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 26, fontWeight: "bold", color: "#333", marginBottom: 10 },
  image: { width: 200, height: 200, marginBottom: 20 },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#444",
    alignSelf: "flex-start",
    marginTop: 10,
    marginBottom: 10,
  },
  badgeInfo: {
    alignItems: "center",
    marginHorizontal: 15,
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 10,
    minWidth: 80,
  },
  badgeLabel: { fontSize: 12, color: "#666", fontWeight: "600" },
  badgeValue: { fontSize: 16, fontWeight: "bold", color: "#333", marginTop: 4 },
  typeBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  typeText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  abilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 5,
    marginBottom: 5,
  },
  abilityText: { color: "#333", fontWeight: "500" },
  statsContainer: {
    width: "100%",
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 15,
  },
  statRow: { flexDirection: "row", alignItems: "center", marginVertical: 6 },
  statName: { width: 80, fontSize: 12, fontWeight: "bold", color: "#666" },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: "hidden",
  },
  statBar: { height: "100%", backgroundColor: "#ef5350", borderRadius: 4 },
  statValue: {
    width: 30,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "bold",
    color: "#444",
  },
  infoText: { marginTop: 10, fontSize: 16, color: "#666" },
  errorText: {
    fontSize: 16,
    color: "#d32f2f",
    textAlign: "center",
    marginBottom: 15,
  },
});
