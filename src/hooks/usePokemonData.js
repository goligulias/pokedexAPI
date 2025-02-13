import { useState, useEffect } from 'react';
import axios from 'axios';

const limit = 20;

export const usePokemonData = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);

  const fetchPokemon = async (currentOffset) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${currentOffset}`
      );
      const detailedPokemon = await Promise.all(
        response.data.results.map(async pokemon => {
          const detailsResponse = await axios.get(pokemon.url);
          return {
            ...pokemon,
            sprite: detailsResponse.data.sprites.front_default,
            id: detailsResponse.data.id,
            height: detailsResponse.data.height,
            weight: detailsResponse.data.weight,
            types: detailsResponse.data.types
          };
        })
      );

      setPokemonList(prevList => [...prevList, ...detailedPokemon]);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch Pokemon');
      setLoading(false);
    }
  };

  const loadMore = () => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    fetchPokemon(newOffset);
  };

  useEffect(() => {
    fetchPokemon(0);
  }, []);

  return { pokemonList, loading, error, loadMore };
};
