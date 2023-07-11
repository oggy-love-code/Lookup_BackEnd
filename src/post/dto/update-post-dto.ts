/* eslint-disable prettier/prettier */
import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class UpdatePostDto {

    @IsNotEmpty()
    content: string;

    images: string[];
}