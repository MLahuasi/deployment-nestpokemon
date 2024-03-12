import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  //Configurar conexión SchemaPokemon con la Base de Datos
  imports: [
    //Inyectar ConfigurationService en el módulo
    ConfigModule,
    // Inyectar configuración MongoDB
    MongooseModule.forFeature([
      {
        name: Pokemon.name,
        schema: PokemonSchema,
      },
    ]),
  ],

  //Exportar servicio de pokemon
  exports: [PokemonService, MongooseModule],
})
export class PokemonModule {}
