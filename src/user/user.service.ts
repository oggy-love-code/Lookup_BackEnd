/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException, Session } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import mongoose, { ObjectId } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user-dto';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user-dto';
import { UserDetails } from 'src/utils/types';
import { Response } from 'express';
import { UpdateUserDto } from './dto/update-user-dto';
import { UserGateway } from './user.gateway';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private userModel: mongoose.Model<User>,
        private cloudinaryService: CloudinaryService,
        private jwtService: JwtService,
        private userGateway: UserGateway,
    ) { }

    async create(user: CreateUserDto, res: Response) {
        if (user.password !== user.confirmPassword) {
            throw Error("Please input confirm password match password")
        } else {
            user.hashPassword = await bcrypt.hash(user.password, 8);
            const newUser = await this.userModel.create(user);
            await newUser.save();

            delete newUser.password;

            const jwt = await this.jwtService.signAsync({ newUser });

            const options = {
                expires: new Date(
                    Date.now() + 3 * 24 * 60 * 60 * 1000
                ),
                httpOnly: true
            };

            res.status(200).cookie('jwt', jwt, options).json({
                jwt,
                user: newUser
            });
        }

    }

    async findUserNameById(userId: string) {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async validateUser(email: string, password: string): Promise<User | undefined> {

        const user = await this.userModel.findOne({ email }).exec();
        const doesUserExist = !!user;

        if (!doesUserExist) return null;

        const doesPasswordMatch = await bcrypt.compare(password, user.hashPassword);

        if (!doesPasswordMatch) return null;

        return user;
    }

    async login(loginDto: LoginUserDto, res: Response) {
        const { email, password } = loginDto;

        const user = await this.validateUser(email, password);

        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isPasswordMatched = await bcrypt.compare(password, user.hashPassword);

        if (!isPasswordMatched) {
            throw new UnauthorizedException('Invalid password')
        }

        const jwt = await this.jwtService.signAsync({ user });

        const options = {
            expires: new Date(
                Date.now() + 3 * 24 * 60 * 60 * 1000
            ),
            httpOnly: true
        };

        res.status(200).cookie('jwt', jwt, options).json({
            user,
            jwt,
        })
    }

    async logout(res: Response) {
        res.cookie("jwt", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });

        res.status(200).json({
            message: "Logouted out"
        })
    }

    async googleLogin(email: string): Promise<{ token: string } | undefined> {
        const jwt = await this.jwtService.signAsync({ email });
        return { token: jwt }
    }

    async findUserGoogle(email: any): Promise<User> {
        const user = await this.userModel.findOne(email);
        return user;
    }

    async findUserLocal(email: string): Promise<User | undefined> {
        const user = await this.userModel.findOne({ email })
        return user;
    }

    async createUserGoogle(details: UserDetails) {
        const newUser = await this.userModel.create(details);
        return newUser.save();
    }

    async findUserService(id: ObjectId) {
        const user = await this.userModel.findById(id);
        return user;
    }

    async findUserById(userId: string) {
        try {
            const user = await this.userModel.findById(userId).select("-hashPassword");
            return user;
        } catch (error) {
            throw error
        }
    }

    async editUser(userId: string, userData: UpdateUserDto) {
        try {
            const user = await this.userModel.findById(userId).select("-hashPassword");
            if (user) {
                user.name = userData.name;
                user.categoryBusiness = userData.categoryBusiness;
                user.phoneNumber = userData.phoneNumber;
                user.ward = userData.address;
                if (userData.image && user.image !== userData.image) {
                    user.image = (await this.cloudinaryService.convertImagesCloudinary(userData.image))
                }
                this.userGateway.handleUpdateUser(user);
                return await user.save();
            } else {
                throw Error("User not found")
            }
        } catch (error) {
            throw error
        }
    }

}
