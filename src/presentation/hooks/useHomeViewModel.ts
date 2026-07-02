import { useEffect, useState } from "react";
import { PokemonRepositoryImpl } from "../../data/repositories/PokemonRepositoryImpl";
import { Pokemon } from "../../domain/entities/Pokemon";
import { GetPokemonListUseCase } from "../../domain/usecases/GetPokemonListUseCase";

const pokemonRepository = new PokemonRepositoryImpl();
const getPokemonListUseCase = new GetPokemonListUseCase(pokemonRepository);

export const useHomeViewModel = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPokemons = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getPokemonListUseCase.execute(20, 0);
      setPokemons(data);
    } catch (err) {
      setError(
        "No se pudieron cargar los Pokémon. Por favor, verifica tu conexión.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemons();
  }, []);

  return {
    pokemons,
    isLoading,
    error,
    refetch: fetchPokemons,
  };
};
