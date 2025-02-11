import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { usePokemonData } from "./src/hooks/usePokemonData";

export default function App() {
  const { pokemonList, loading, error, loadMore } = usePokemonData();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading Pokemon...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokedex</Text>
      <FlatList
        data={pokemonList}
        keyExtractor={(item) => item.name}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <View style={styles.pokemonItem}>
            <Image 
              source={{ uri: item.sprite }}
              style={styles.pokemonSprite}
            />
            <Text style={styles.pokemonName}>{item.name}</Text>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={loadMore}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Load More</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c4e4b2",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 50,
    textAlign: "left",
  },
  row: {
    flex: 1,
    justifyContent: "space-around",
  },
  pokemonItem: {
    flex: 1,
    padding: 15,
    margin: 5,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    alignItems: "center",
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pokemonSprite: {
    width: 100,
    height: 100,
    marginBottom: 5,
  },
  pokemonName: {
    fontSize: 16,
    textTransform: "capitalize",
    textAlign: "center",
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#4CAF50",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
  },
});
