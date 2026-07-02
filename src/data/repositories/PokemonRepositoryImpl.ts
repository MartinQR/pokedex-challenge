import { Pokemon } from "../../domain/entities/Pokemon";
import { PokemonRepository } from "../../domain/repositories/PokemonRepository";
import { apiClient } from "../datasources/apiClient";
import {
  PokemonDetailResponseDTO,
  PokemonListResponseDTO,
} from "../models/PokemonDTO";
import { PokemonMapper } from "../models/PokemonMapper";

export class PokemonRepositoryImpl implements PokemonRepository {
  async getPokemonList(limit: number, offset: number): Promise<Pokemon[]> {
    try {
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

      return pokemonList;
    } catch (error) {
      console.error("Error fetching pokemon list in Repository:", error);
      throw error;
    }
  }

  async getPokemonDetail(id: number): Promise<Pokemon> {
    try {
      const response = await apiClient.get<PokemonDetailResponseDTO>(
        `pokemon/${id}`,
      );

      return PokemonMapper.toDomain(response.data);
    } catch (error) {
      console.error(
        `Error fetching pokemon detail for ID ${id} in Repository:`,
        error,
      );
      throw error;
    }
  }
}
