/* eslint-disable prettier/prettier */
import { IsNotEmpty } from "class-validator";
export class CreateCommentDto {

    @IsNotEmpty()
    content: string;
}