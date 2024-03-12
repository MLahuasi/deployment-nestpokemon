import { Injectable } from '@nestjs/common';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

//import axios, { AxiosInstance } from 'axios';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  //Inyectar Servicios PokemonService
  constructor(
    private readonly pokemonService: PokemonService,
    //Usar Patron Adapter en
    private readonly http: AxiosAdapter,
  ) {}

  //Se implementa en Adapter [./02-pokedex/src/common/adapters/axios.adapter.ts]
  //private readonly axios: AxiosInstance = axios;

  async executeSEED() {
    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );
    const response = data.results.map(({ name, url }) => {
      const segmentos = url.split('/');
      // + transforma a número un string
      const no = +segmentos[segmentos.length - 2];
      return {
        no,
        name,
      };
    });

    await this.pokemonService.createByLote(response);
    return 'Seed Ejecutado';
  }
}
