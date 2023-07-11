/* eslint-disable prettier/prettier */
import { Controller, Get, Put, Request, Res, UseGuards, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { JwtGuard } from 'src/auth/utils/JwtGuard';
import { UpdateUserDto } from './dto/update-user-dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @UseGuards(JwtGuard)
    @Get()
    async getUserDetail(@Request() req, @Res() res: Response) {
        try {
            const user = await this.userService.findUserById(req.user._id);
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    @UseGuards(JwtGuard)
    @Get(":userId")
    async getUserById(@Request() req, @Res() res: Response, @Param('userId') userId: string) {
        try {
            const user = await this.userService.findUserById(userId);
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    @UseGuards(JwtGuard)
    @Put(':userId')
    async editUser(
        @Request() req,
        @Res() res: Response,
        @Param('userId') userId: string,
        @Body() userData: UpdateUserDto) {
        try {
            const user = await this.userService.editUser(userId, userData);
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

}
