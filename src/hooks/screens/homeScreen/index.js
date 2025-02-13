import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
  TextInput,
} from 'react-native';
import { useState } from 'react';
import { usePokemonData } from '../../usePokemonData';
import { styles } from './styles';

export const HomeScreen = () => {
  const { pokemonList, loading, error, loadMore } = usePokemonData();
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchPokemon, setSearchPokemon] = useState('');

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const filteredPokemon = pokemonList.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchPokemon.toLowerCase())
  );

  const renderModal = () => {
    if (!selectedPokemon) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>

            <Image source={{ uri: selectedPokemon?.sprite }} style={styles.modalPokemonImage} />
            <Text style={styles.modalPokemonName}>{selectedPokemon?.name}</Text>

            <View style={styles.statsContainer}>
              <Text style={styles.statText}>Height: {selectedPokemon?.height / 10}m</Text>
              <Text style={styles.statText}>Weight: {selectedPokemon?.weight / 10}kg</Text>
            </View>
            <View style={styles.typesContainer}>
              {selectedPokemon?.types?.map((type, index) => (
                <View key={index}>
                  <Text style={styles.typeText}>{type.type.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderPokemonItem = ({ item }) => (
    <TouchableOpacity
      style={styles.pokemonItem}
      onPress={() => {
        setSelectedPokemon(item);
        setModalVisible(true);
      }}
    >
      <Image source={{ uri: item.sprite }} style={styles.pokemonSprite} />
      <Text style={styles.pokemonName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokedex</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Pokemon..."
          value={searchPokemon}
          onChangeText={setSearchPokemon}
          clearButtonMode="while-editing"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <FlatList
        data={filteredPokemon}
        keyExtractor={item => item.name}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={renderPokemonItem}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.loadMoreButton}
            onPress={loadMore}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.loadMoreText}>Load More</Text>
            )}
          </TouchableOpacity>
        }
      />
      {renderModal()}
    </View>
  );
};
