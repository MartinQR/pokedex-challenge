import { Pokemon } from "../entities/Pokemon";
import { PokemonRepository } from "../repositories/PokemonRepository";

export class GetPokemonDetailUseCase {
  constructor(private pokemonRepository: PokemonRepository) {}

  async execute(id: number): Promise<Pokemon> {
    return await this.pokemonRepository.getPokemonDetail(id);
  }
}
