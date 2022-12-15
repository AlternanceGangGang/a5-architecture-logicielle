import { InMemoryPokemonGateway } from "@/adapters/secondary/inMemoryPokemonGateway";
import { getOnePokemon } from "@/core/usecases/get-one-pokemon/getOnePokemon";
import { bulbasaur, pikachu } from "@/core/entities/pokemon.data";

describe("Get the data of a pokemon with his id", () => {
  let pokemonGateway: InMemoryPokemonGateway;

  beforeEach(() => {
    pokemonGateway = new InMemoryPokemonGateway();
  });

  describe("first validates the id", () => {
    it("should throw an invalid id error if id is not a number", async () => {
      expect(() => getOnePokemon(pokemonGateway, NaN)).toThrow(
        "Invalid id NaN"
      );
    });

    it("should throw an invalid id error if id is less than 1", async () => {
      expect(() => getOnePokemon(pokemonGateway, 0)).toThrow("Invalid id 0");
    });

    it("should not throw an error if id is valid", async () => {
      pokemonGateway.feedWith(bulbasaur);
      expect(() => getOnePokemon(pokemonGateway, 1)).not.toThrow();
    });
  });

  describe("then it gets the pokemon", () => {
    it("should return error if id does not exist", async () => {
      expect(() => getOnePokemon(pokemonGateway, 9999)).toThrow(
        "Pokemon not found with id 9999"
      );
    });

    it("should return the pokemon with corresponding id", async () => {
      pokemonGateway.feedWith(pikachu);
      expect(await getOnePokemon(pokemonGateway, 25)).toBe(pikachu);
    });
  });
});