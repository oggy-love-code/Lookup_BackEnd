/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsString } from "class-validator";

export class CreatePostDto {

    @IsNotEmpty()
    content: string;

    images: string[];
}