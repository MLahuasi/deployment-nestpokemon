import { IsInt, IsPositive, IsString, Min, MinLength, IsOptional } from "class-validator";

export class CreatePokemonDto {

    //IsInt, isPositive, min 1
    @IsInt()
    @IsPositive()
    @Min(1)
    no: number;

    //isString, MinLenth 1
    @IsString()
    @MinLength(1)
    name: string;
}
