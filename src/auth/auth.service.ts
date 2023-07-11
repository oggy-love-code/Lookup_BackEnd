/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { CreateUserDto } from 'src/user/dto/create-user-dto';
import { LoginUserDto } from 'src/user/dto/login-user-dto';
import { UserService } from 'src/user/user.service';
import { UserDetails } from 'src/utils/types';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/schema/user.schema';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(private userService: UserService) { }

    async register(user: CreateUserDto, res: Response) {
        return this.userService.create(user, res);
    }

    async validateUser(details: UserDetails) {
        console.log('AuthService');
        console.log(details);
        const user = await this.userService.findUserGoogle({ email: details.email });
        console.log(user);
        if (user) {
            console.log("Check user is valid: ", user);
            return user;
        }
        console.log('User not found. Creating...');
        return this.userService.createUserGoogle(details);

    }

    async loginUser(loginUserDto: LoginUserDto, res: Response) {
        return this.userService.login(loginUserDto, res)
    }

    async logout(res: Response) {
        return this.userService.logout(res);
    }

    async findUser(id: ObjectId) {
        return this.userService.findUserService(id);
    }

    async googleLogin(email: string): Promise<{ token: string } | undefined> {
        return this.userService.googleLogin(email);
    }
}
