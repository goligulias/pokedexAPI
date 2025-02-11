import { useState, useEffect } from "react";
import axios from "axios";

const limit = 20;

export const usePokemonData = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentOffset, setCurrentOffset] = useState(0);

  const fetchPokemon = async (offset) => {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`
      );
      
      // Fetch detailed information for each Pokemon
      const detailedPokemon = await Promise.all(
        response.data.results.map(async (pokemon) => {
          const detailsResponse = await axios.get(pokemon.url);
          return {
            ...pokemon,
            sprite: detailsResponse.data.sprites.front_default,
            id: detailsResponse.data.id
          };
        })
      );

      if (offset === 0) {
        setPokemonList(detailedPokemon);
      } else {
        setPokemonList((prevList) => [...prevList, ...detailedPokemon]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Pokemon:", error.message);
      setError("Failed to fetch Pokemon");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon(0);
  }, []);

  const loadMore = () => {
    if (!loading) {
      setLoading(true);
      const nextOffset = currentOffset + limit;
      setCurrentOffset(nextOffset);
      fetchPokemon(nextOffset);
    }
  };

  return { pokemonList, loading, error, loadMore };
};
