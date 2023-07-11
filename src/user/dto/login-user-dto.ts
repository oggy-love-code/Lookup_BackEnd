/* eslint-disable prettier/prettier */
import { IsEmail, IsEmpty, IsString, MinLength } from "class-validator";

export class LoginUserDto {

    @IsEmpty()
    @IsEmail({}, { message: 'Please enter correct email' })
    readonly email: string;

    @IsEmpty()
    @IsString()
    @MinLength(6)
    password: string;
}