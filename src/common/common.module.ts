import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapters/axios.adapter';

//Configurar que AxiosAdapter pueda ser exportado
@Module({
  providers: [AxiosAdapter],
  exports: [AxiosAdapter],
})
export class CommonModule {}
