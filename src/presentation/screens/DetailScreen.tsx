import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
  ActivityIndicator,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TYPE_CONFIG } from "../constans/typeConfig";
import { useDetailViewModel } from "../hooks/useDetailViewModel";
import { NavigationProps, RootStackParamList } from "../navigation/types";

type DetailScreenRouteProp = RouteProp<RootStackParamList, "Detail">;

export const DetailScreen = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const navigation = useNavigation<NavigationProps<"Detail" | "Home">>();
  const { pokemonId } = route.params;

  const { pokemon, isLoading, error, refetch } = useDetailViewModel(pokemonId);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#ef5350" />
        <Text style={styles.infoText}>Loading details...</Text>
      </View>
    );
  }

  if (error || !pokemon) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          {error || "An unexpected error occurred."}
        </Text>
        <Button title="Retry" onPress={refetch} color="#ef5350" />
      </View>
    );
  }

  const mainType = pokemon.types[0] || "default";
  const typeConfig = TYPE_CONFIG[mainType] || TYPE_CONFIG.default;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: typeConfig.color }]}
      edges={["top"]}
    >
      <View style={styles.customHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Return to the Pokémon list"
        >
          <Text
            style={[styles.backButtonText, { color: typeConfig.textColor }]}
          >
            BACK
          </Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitleText, { color: typeConfig.textColor }]}>
          {typeConfig.emoji} {mainType.toUpperCase()}
        </Text>
      </View>
      <View style={styles.mainWhiteWrapper}>
        <ScrollView
          style={styles.whiteCardContainer}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>
            <Text style={styles.idNumber}>
              #{pokemon.id.toString().padStart(3, "0")}{" "}
            </Text>
            {pokemon.name.toUpperCase()}
          </Text>

          <Image
            source={{ uri: pokemon.imageUrl }}
            style={styles.image}
            resizeMode="contain"
            accessible={true}
            accessibilityRole="image"
            accessibilityLabel={`Official image of ${pokemon.name}`}
          />

          <View style={styles.row}>
            <View
              style={styles.badgeInfo}
              accessible={true}
              accessibilityLabel={`Height: ${pokemon.height / 10} metros`}
            >
              <Text style={styles.badgeLabel}>Height</Text>
              <Text style={styles.badgeValue}>{pokemon.height / 10} m</Text>
            </View>
            <View
              style={styles.badgeInfo}
              accessible={true}
              accessibilityLabel={`Weight: ${pokemon.weight / 10} kilograms`}
            >
              <Text style={styles.badgeLabel}>Weight</Text>
              <Text style={styles.badgeValue}>{pokemon.weight / 10} kg</Text>
            </View>
            <View
              style={styles.badgeInfo}
              accessible={true}
              accessibilityLabel={`Base experience: ${pokemon.baseExperience} `}
            >
              <Text style={styles.badgeLabel}>Base Exp</Text>
              <Text style={styles.badgeValue}>{pokemon.baseExperience}</Text>
            </View>
          </View>

          {/* SECCIÓN DE TIPOS  */}
          <Text style={styles.sectionTitle}>Types</Text>
          <View style={styles.rowLeft}>
            {pokemon.types.map((type) => {
              const currentConfig = TYPE_CONFIG[type] || TYPE_CONFIG.default;
              return (
                <View
                  key={type}
                  style={[
                    styles.typeBadge,
                    { backgroundColor: currentConfig.color },
                  ]}
                >
                  <Text
                    style={[
                      styles.typeText,
                      { color: currentConfig.textColor },
                    ]}
                  >
                    {currentConfig.emoji} {type.toUpperCase()}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* SECCIÓN DE HABILIDADES */}
          <Text style={styles.sectionTitle}>Abilities</Text>
          <View style={styles.rowLeft}>
            {pokemon.abilities.map((ability) => (
              <View key={ability} style={styles.abilityBadge}>
                <Text style={styles.abilityText}>
                  {ability.charAt(0).toUpperCase() + ability.slice(1)}
                </Text>
              </View>
            ))}
          </View>

          {/* SECCIÓN DE ESTADÍSTICAS  */}
          <Text style={styles.sectionTitle}>Base Stats</Text>
          <View style={styles.statsContainer}>
            {pokemon.stats.map((stat) => (
              <View
                key={stat.name}
                style={styles.statRow}
                accessible={true}
                accessibilityLabel={`Statistics ${stat.name}: ${stat.value} pointsf.`}
              >
                <Text style={styles.statName}>{stat.name.toUpperCase()}</Text>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.statBar,
                      {
                        width: `${Math.min(stat.value, 100)}%`,
                        backgroundColor: typeConfig.textColor,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  customHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
  headerTitleText: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1,
  },
  whiteCardContainer: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  scrollContainer: {
    padding: 24,
    alignItems: "center",
    paddingBottom: 30,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#2C3E50",
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  idNumber: {
    color: "rgba(0, 0, 0, 0.2)",
    fontWeight: "700",
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 24,
  },
  rowLeft: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    width: "100%",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2C3E50",
    alignSelf: "flex-start",
    marginTop: 12,
    marginBottom: 12,
  },
  badgeInfo: {
    alignItems: "center",
    marginHorizontal: 8,
    backgroundColor: "#F8F9FA",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 16,
    minWidth: 90,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  badgeLabel: {
    fontSize: 14,
    color: "#7F8C8D",
    fontWeight: "600",
  },
  badgeValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2C3E50",
    marginTop: 4,
  },
  typeBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 6,
  },
  typeText: {
    fontWeight: "700",
    fontSize: 13,
  },
  abilityBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#F1F2F6",
    marginRight: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#E4E7EB",
  },
  abilityText: {
    color: "#57606F",
    fontWeight: "600",
    fontSize: 13,
  },
  statsContainer: {
    width: "100%",
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E9ECEF",
    marginBottom: 20,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  statName: {
    width: 95,
    fontSize: 11,
    fontWeight: "700",
    color: "#7F8C8D",
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "#E9ECEF",
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: "hidden",
  },
  statBar: {
    height: "100%",
    borderRadius: 4,
  },
  statValue: {
    width: 30,
    textAlign: "right",
    fontSize: 13,
    fontWeight: "700",
    color: "#2C3E50",
  },
  infoText: {
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

  mainWhiteWrapper: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 50,
    overflow: "hidden",
  },
});
