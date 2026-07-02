import { useEffect, useState } from "react";
import { PokemonRepositoryImpl } from "../../data/repositories/PokemonRepositoryImpl";
import { Pokemon } from "../../domain/entities/Pokemon";
import { GetPokemonDetailUseCase } from "../../domain/usecases/GetPokemonDetailUseCase";

const pokemonRepository = new PokemonRepositoryImpl();
const getPokemonDetailUseCase = new GetPokemonDetailUseCase(pokemonRepository);

export const useDetailViewModel = (pokemonId: number) => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPokemonDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getPokemonDetailUseCase.execute(pokemonId);
      setPokemon(data);
    } catch (err) {
      setError("No se pudo cargar la información detallada del Pokémon.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (pokemonId) {
      fetchPokemonDetail();
    }
  }, [pokemonId]);

  return {
    pokemon,
    isLoading,
    error,
    refetch: fetchPokemonDetail,
  };
};
