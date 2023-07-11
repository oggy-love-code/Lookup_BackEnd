/* eslint-disable prettier/prettier */
import { IsPhoneNumber, IsString } from 'class-validator';

export class UpdateUserDto {

    @IsString()
    readonly name: string;

    @IsString()
    readonly categoryBusiness: string;

    @IsPhoneNumber('VN')
    @IsString()
    readonly phoneNumber: string;

    @IsString()
    readonly address: string;

    @IsString()
    readonly image: string[];
}