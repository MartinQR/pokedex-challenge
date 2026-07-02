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
      // Traer datos de la red primero
      const response = await apiClient.get<PokemonListResponseDTO>(
        `pokemon?limit=${limit}&offset=${offset}`,
      );
      const { results } = response.data;

      const pokemonList = results.map((item) => {
        const urlParts = item.url.split("/");
        const id = parseInt(urlParts[urlParts.length - 2], 10);

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
      });

      // Guardar copia local para el futuro
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

      // Estrategia Fallback: Si no hay internet, buscamos en el disco
      const cachedData = await AsyncStorage.getItem(CACHE_KEYS.POKEMON_LIST);

      if (cachedData) {
        // Encontró datos viejos guardados, los devolvemos para salvar la UX offline
        return JSON.parse(cachedData);
      }

      // Si no hay red Y tampoco hay caché (primera vez que abre la app), lanzamos el error original
      throw error;
    }
  }

  // 2. Obtener detalle con soporte offline parcial
  async getPokemonDetail(id: number): Promise<Pokemon> {
    const cacheKey = `${CACHE_KEYS.POKEMON_DETAIL_PREFIX}${id}`;

    try {
      // Intento primario: API
      const response = await apiClient.get<PokemonDetailResponseDTO>(
        `pokemon/${id}`,
      );
      const domainPokemon = PokemonMapper.toDomain(response.data);

      // Guardamos el detalle específico de este Pokémon
      await AsyncStorage.setItem(cacheKey, JSON.stringify(domainPokemon));

      return domainPokemon;
    } catch (error) {
      console.warn(
        `Network failed. Attempting to load pokemon detail for ID ${id} from local cache...`,
        error,
      );

      // Estrategia Fallback: Buscar este Pokémon específico en el disco
      const cachedData = await AsyncStorage.getItem(cacheKey);

      if (cachedData) {
        return JSON.parse(cachedData);
      }

      throw error;
    }
  }
}
