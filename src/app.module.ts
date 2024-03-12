import { join } from 'path'; //Propio de Node
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { JoinValidationSchema } from './config/joi.validation';
import { EnvConfiguration } from './config/env.config';

import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    //Configurar el acceso a las variables de entorno
    //Siempre está al inicio
    ConfigModule.forRoot({
      //Configurar archivo de mapeo de variables de entorno
      load: [EnvConfiguration],
      //Configurar joi
      validationSchema: JoinValidationSchema,
    }),

    //Servir contenido estático
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    //Configurar acceso a MongoDB
    //MongooseModule.forRoot('mongodb://localhost:27017/nest-pokemon'),
    //Usar variables de entorno
    MongooseModule.forRoot(process.env.MONGODB, {
      dbName: 'pokemondb',
    }),

    PokemonModule,

    CommonModule,

    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor() {
    //Ver variables de entorno
    //console.log(process.env);
  }
}
