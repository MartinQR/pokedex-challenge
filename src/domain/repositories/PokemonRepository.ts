import { Pokemon } from "../entities/Pokemon";

export interface PokemonRepository {
  getPokemonList(limit: number, offset: number): Promise<Pokemon[]>;
  getPokemonDetail(id: number): Promise<Pokemon>;
}
