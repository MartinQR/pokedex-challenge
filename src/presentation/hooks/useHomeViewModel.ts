import { useEffect, useState } from "react";
import { PokemonRepositoryImpl } from "../../data/repositories/PokemonRepositoryImpl";
import { Pokemon } from "../../domain/entities/Pokemon";
import { GetPokemonListUseCase } from "../../domain/usecases/GetPokemonListUseCase";

const pokemonRepository = new PokemonRepositoryImpl();
const getPokemonListUseCase = new GetPokemonListUseCase(pokemonRepository);

const LIMIT = 20;
export const useHomeViewModel = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchPokemons = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setOffset(0);
      setHasMore(true);

      const data = await getPokemonListUseCase.execute(LIMIT, 0);
      setPokemons(data);
    } catch (err) {
      setError(
        "No se pudieron cargar los Pokémon. Por favor, verifica tu conexión.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNextPage = async () => {
    if (isLoading || isFetchingMore || !hasMore) return;

    try {
      setIsFetchingMore(true);
      const nextOffset = offset + LIMIT;

      const newPokemons = await getPokemonListUseCase.execute(
        LIMIT,
        nextOffset,
      );

      if (newPokemons.length === 0) {
        setHasMore(false);
      } else {
        setPokemons((prev) => [...prev, ...newPokemons]);
        setOffset(nextOffset);
      }
    } catch (err) {
      console.error("Error cargando más Pokémon:", err);
    } finally {
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchPokemons();
  }, []);

  return {
    pokemons,
    isLoading,
    isFetchingMore,
    error,
    refetch: fetchPokemons,
    fetchNextPage,
  };
};
