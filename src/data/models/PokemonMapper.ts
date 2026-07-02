import { Pokemon } from "../../domain/entities/Pokemon";
import { PokemonDetailResponseDTO } from "./PokemonDTO";

export class PokemonMapper {
  static toDomain(dto: PokemonDetailResponseDTO): Pokemon {
    return {
      id: dto.id,
      name: dto.name,
      imageUrl: dto.sprites.front_default || "",
      height: dto.height,
      weight: dto.weight,
      baseExperience: dto.base_experience,
      types: dto.types.map((t) => t.type.name),
      abilities: dto.abilities.map((a) => a.ability.name),
      stats: dto.stats.map((s) => ({
        name: s.stat.name,
        value: s.base_stat,
      })),
    };
  }
}
