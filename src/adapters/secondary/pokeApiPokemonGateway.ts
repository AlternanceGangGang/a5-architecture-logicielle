import { PokemonGateway } from "@/core/gateways/pokemonGateway";
import { Pokemon, PokemonType } from "@/core/entities/pokemon";
import axios, {AxiosResponse} from "axios";

export class PokeApiPokemonGateway implements PokemonGateway {

  public findOne(id: number): Promise<Pokemon> {
    return axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`, { headers: { "Accept-Encoding": "gzip,deflate,compress" } })
      .then((response) => response.data)
      .then((data: ApiPokemon) => this.toPokemon(data));
  }

  public async listAll(): Promise<Array<Pokemon>> {
    const pokemonsFromApi: ApiResource[] = await axios.get(
      "https://pokeapi.co/api/v2/pokemon/?limit=100", { headers: { "Accept-Encoding": "gzip,deflate,compress" } }
    )
      .then((response) => response.data)
      .then((data: { results: ApiResource[] }) => data.results.sort((a: any, b: any) => a.id - b.id));

    return Promise.all(
      pokemonsFromApi.map((pokemon) =>
        axios.get(pokemon.url, { headers: { "Accept-Encoding": "gzip,deflate,compress" } })
          .then((response) => response.data)
          .then((data: ApiPokemon) => this.toPokemon(data))
      )
    );
  }

  public async getPokemonByType(type: any): Promise<Array<Pokemon>> {
    return await axios.get(
      `https://pokeapi.co/api/v2/type/${type}`, { headers: { "Accept-Encoding": "gzip,deflate,compress" } }
    ).then((response: AxiosResponse<ApiTypeResponse>) => response.data.pokemon);
  }

  private toPokemon(data: ApiPokemon): Pokemon {
    return {
      id: data.id,
      name: data.name,
      weight: data.weight,
      types: data.types.map(
        (type: ApiPokemonType) => type.type.name as PokemonType
      ),
      description: data.name,
    };
  }

  public getAllTypes(): Promise<PokemonType> {
    // If we want to improve, we can use the data from api
    // => but seems we have more types than them
    // https://pokeapi.co/api/v2/type
    return Promise.resolve(PokemonType as any);
  }
}

interface ApiPokemon {
  id: number;
  name: string;
  weight: number;
  types: ApiPokemonType[];
}
interface ApiPokemonType {
  slot: number;
  type: ApiResource;
}

interface ApiResource {
  name: string;
  url: string;
}

interface ApiTypeResponse {
  pokemon : Array<Pokemon>;
}
