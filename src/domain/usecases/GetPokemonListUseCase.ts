import { Pokemon } from "../entities/Pokemon";
import { PokemonRepository } from "../repositories/PokemonRepository";

export class GetPokemonListUseCase {
  constructor(private pokemonRepository: PokemonRepository) {}

  async execute(limit: number, offset: number): Promise<Pokemon[]> {
    return await this.pokemonRepository.getPokemonList(limit, offset);
  }
}
