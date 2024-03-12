import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

//Para que sea un documento de Mongo debe extender de Document
//Ademas se debe agregar el decorador Schema
@Schema()
export class Pokemon extends Document {
  //Nota: el Id lo define MongoDB

  //Agregar validaciones
  @Prop({ unique: true, index: true }) name: string;

  @Prop({
    unique: true,
    index: true,
  })
  no: number;
}

//Exportar Esquema
export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
