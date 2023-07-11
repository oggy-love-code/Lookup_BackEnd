/* eslint-disable prettier/prettier */
import { Body, Controller, Post, UsePipes, ValidationPipe, Get, UseGuards, Req, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user-dto';
import { GoogleAuthGuard } from './utils/Guards';
import { LoginUserDto } from 'src/user/dto/login-user-dto';
import { User } from 'src/user/schema/user.schema';
import { Response } from 'express';
import { JwtGuard } from './utils/JwtGuard';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private userService: UserService) { }

    @UsePipes(new ValidationPipe())
    @Post('register')
    async registerUser(@Body() user: CreateUserDto, @Res() res: Response) {
        return this.authService.register(user, res);
    }


    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() user: LoginUserDto, @Res({ passthrough: true }) res: Response) {
        return this.authService.loginUser(user, res);
    }

    @Get('/logout')
    async logout(@Res() res: Response) {
        return this.authService.logout(res);
    }

    @Get('google/login')
    @UseGuards(GoogleAuthGuard)
    async handleLogin() {
        return {}
    }

    @Get('google/redirect')
    @UseGuards(GoogleAuthGuard)
    async handleRedirect(@Req() req): Promise<{ token: string } | undefined> {
        return this.authService.googleLogin(req.user.email)
    }

    @UseGuards(JwtGuard)
    @Get('/me')
    async getUserDetail(@Req() req) {
        return this.userService.findUserById(req.user.id);
    }

    // @Get('status')
    // user(@Req() req) {
    //     console.log(req.user);
    //     if (req.user) {
    //         return { msg: 'Authenticated' };
    //     } else {
    //         return { msg: 'Not Authenticated' };
    //     }
    // }

}
