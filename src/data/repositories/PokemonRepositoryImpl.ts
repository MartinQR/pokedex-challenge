import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pokemon } from "../../domain/entities/Pokemon";
import { PokemonRepository } from "../../domain/repositories/PokemonRepository";
import { apiClient } from "../datasources/apiClient";
import {
  PokemonDetailResponseDTO,
  PokemonListResponseDTO,
} from "../models/PokemonDTO";
import { PokemonMapper } from "../models/PokemonMapper";

// Llaves de almacenamiento local
const CACHE_KEYS = {
  POKEMON_LIST: "CACHED_POKEMON_LIST",
  POKEMON_DETAIL_PREFIX: "CACHED_POKEMON_DETAIL_",
};

export class PokemonRepositoryImpl implements PokemonRepository {
  //  Obtener listado con soporte offline parcial

  async getPokemonList(limit: number, offset: number): Promise<Pokemon[]> {
    try {
      const response = await apiClient.get<PokemonListResponseDTO>(
        `pokemon?limit=${limit}&offset=${offset}`,
      );
      const { results } = response.data;

      const pokemonList = await Promise.all(
        results.map(async (item) => {
          const urlParts = item.url.split("/");
          const id = parseInt(urlParts[urlParts.length - 2], 10);

          try {
            const detailResponse =
              await apiClient.get<PokemonDetailResponseDTO>(`pokemon/${id}`);

            return PokemonMapper.toDomain(detailResponse.data);
          } catch {
            return {
              id,
              name: item.name,
              imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
              types: [],
              height: 0,
              weight: 0,
              abilities: [],
              baseExperience: 0,
              stats: [],
            };
          }
        }),
      );

      await AsyncStorage.setItem(
        CACHE_KEYS.POKEMON_LIST,
        JSON.stringify(pokemonList),
      );

      return pokemonList;
    } catch (error) {
      console.warn(
        "Network failed or slow. Attempting to load pokemon list from local cache...",
        error,
      );

      const cachedData = await AsyncStorage.getItem(CACHE_KEYS.POKEMON_LIST);

      if (cachedData) {
        return JSON.parse(cachedData);
      }

      throw error;
    }
  }

  async getPokemonDetail(id: number): Promise<Pokemon> {
    const cacheKey = `${CACHE_KEYS.POKEMON_DETAIL_PREFIX}${id}`;

    try {
      const response = await apiClient.get<PokemonDetailResponseDTO>(
        `pokemon/${id}`,
      );
      const domainPokemon = PokemonMapper.toDomain(response.data);

      await AsyncStorage.setItem(cacheKey, JSON.stringify(domainPokemon));

      return domainPokemon;
    } catch (error) {
      console.warn(
        `Network failed. Attempting to load pokemon detail for ID ${id} from local cache...`,
        error,
      );

      const cachedData = await AsyncStorage.getItem(cacheKey);

      if (cachedData) {
        return JSON.parse(cachedData);
      }

      throw error;
    }
  }
}
