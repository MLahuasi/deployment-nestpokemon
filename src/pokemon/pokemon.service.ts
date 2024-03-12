import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

import { isValidObjectId, Model } from 'mongoose';

import { Pokemon } from './entities/pokemon.entity';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {
  private defaultLimit: number;

  //Crear inyeccion de Dependencias del Modelo
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    //Inyectar ConfigurationService en el módulo
    private readonly configService: ConfigService,
  ) {
    //Ver variables de entorno
    //Ver Puerto desde env
    console.log(process.env.PORT);
    //Ver límite de registros env
    console.log(process.env.DEFAULT_LIMIT);

    //Ver Puerto desde configService
    const port = configService.get<number>('port');
    console.log(port);
    //Ver límite de registros configService
    this.defaultLimit = configService.get<number>('defaultLimit');
    console.log(this.defaultLimit);
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    //Manejar Exceptions
    try {
      //Insertra registro usando Modelo
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  //Crear función para realizar una inserción por lote
  async createByLote(createPokemonDtos: CreatePokemonDto[]) {
    //Colocar name en minúsculas
    createPokemonDtos = createPokemonDtos.map((pokemon) => {
      pokemon.name = pokemon.name.toLowerCase();
      return pokemon;
    });

    //Manejar Exceptions
    try {
      //Eliminar registros anteriores
      await this.pokemonModel.deleteMany({});
      //Insertra registro usando Modelo
      await this.pokemonModel.insertMany(createPokemonDtos).then((result) => {
        //console.log(result)
      });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;

    return this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({
        //Ordenar
        no: 1,
      })
      .select('-__v'); //No presentar un campo
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    //Buscar por Id
    //Verificar si id es un número
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }
    //Buscar por Mongo Id
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }
    //Buscar por Name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      });
    }

    //Si no encuentra
    if (!pokemon)
      throw new NotFoundException(
        `Pokemon with id, name or no "${term}" not found`,
      );

    return pokemon;
  }

  //Actualizar Registro
  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    //Asegurar que el nombre se va aguardar en minúsculas
    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {
      //Actualiza un registro y retorna el registro con los nuevos cambios.
      //En caso de asignar "new: true" retorna el objeto antiguo
      // await pokemon.updateOne(updatePokemonDto, { new: true });
      await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async removeWithoutCustomPipe(id: string) {
    const pokemon = await this.findOne(id);
    await pokemon.deleteOne();
  }

  async remove(id: string) {
    //Elimina por Id
    //const result = await this.pokemonModel.findByIdAndDelete(id);
    //Valida que el Id exista y elimina si el Id es correcto
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0)
      throw new BadRequestException(`Pokemon with id "${id}" not found`);

    return;
  }

  //Validar Errores
  private handleExceptions(error: any) {
    //Error Registro Duplicado
    if (error.code === 11000) {
      //E11000 duplicate key error collection
      const { keyValue } = error;
      const { no, name } = error.result.result.writeErrors[0].err.op;

      if (keyValue !== undefined)
        throw new BadRequestException(
          `Pokemon exitis in db ${JSON.stringify(error.keyValue)}`,
        );

      if (no !== undefined && name !== undefined)
        throw new BadRequestException(`Pokemon ${name} #${no} exitis in db`);

      throw new BadRequestException(error);
    }
    //Error interno
    console.log(error);
    throw new InternalServerErrorException(
      `Can't createPokemon - Check server logs`,
    );
  }
}
