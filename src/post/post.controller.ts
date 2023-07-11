/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Get, Param, Put, Delete, UseGuards, Res, Request } from '@nestjs/common';
import { PostService } from './post.service';
import { Response } from 'express';
import { CreatePostDto } from './dto/create-post-dto';
import { Posts } from './schema/post.schema';
import { ObjectId } from 'mongoose';
import { UpdatePostDto } from './dto/update-post-dto';
import { JwtGuard } from 'src/auth/utils/JwtGuard';
import { UserService } from 'src/user/user.service';
import { CreateCommentDto } from '../comment/dto/create-comment-dto';
import { GoogleAuthGuard } from 'src/auth/utils/Guards';

@Controller('post')
export class PostController {
    constructor(
        private postService: PostService,
        private userService: UserService) { }

    @UseGuards(JwtGuard)
    @Get()
    async getAllPost(
        @Res() res: Response,
        @Request() req,
    ) {
        try {
            const posts = await this.postService.getAll();
            res.status(200).json(posts)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    @UseGuards(JwtGuard)    
    @Post()
    async createPost(
        @Res() res: Response,
        @Request() req,
        @Body() post: CreatePostDto,
    ) {
        try {
            const newPost = await this.postService.create(req.user._id, post);
            res.status(201).json(newPost)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    @Get('owner')
    async getOwnerPost(
        @Res() res: Response,
        @Request() req,
        @Body() userId: string
    ) {
        try {
            const user = await this.postService.getUserDetail(userId);
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    @UseGuards(JwtGuard)
    @Put(':postId')
    async updatePost(
        @Res() res: Response,
        @Request() req,
        @Param('postId') postId: string,
        @Body() post: UpdatePostDto
    ) {
        try {
            const newPost = await this.postService.update(postId, post, req.user.id);
            res.status(200).json(newPost);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    @UseGuards(JwtGuard)
    @Post('like/like/:postId')
    async likePost(
        @Res() res: Response,
        @Request() req,
        @Param('postId') postId: string
    ) {
        try {
            const newPost = await this.postService.likePost(postId, req.user._id);
            res.status(200).json(newPost);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    @UseGuards(JwtGuard)
    @Post('like/unlike/:postId')
    async unlikePost(
        @Res() res: Response,
        @Request() req,
        @Param('postId') postId: string
    ) {
        try {
            const newPost = await this.postService.unlikePost(postId, req.user._id);
            res.status(200).json(newPost);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    @UseGuards(JwtGuard)
    @Get(':postId')
    async getPost(
        @Res() res: Response,
        @Param('postId') postId: string
    ) {
        try {
            const post = await this.postService.getPost(postId);
            res.status(200).json(post);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    @UseGuards(JwtGuard)
    @Get('profile/:userId')
    async getUserPosts(
        @Res() res: Response,
        @Param('userId') userId: string
    ) {
        try {
            const posts = await this.postService.getUserProfilePosts(userId);
            res.status(200).json(posts)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    @UseGuards(JwtGuard)
    @Delete(':postId')
    async deletePost(
        @Res() res: Response,
        @Request() req,
        @Param('postId') postId: string
    ) {
        try {
            const newPost = this.postService.delete(postId, req.user._id);
            res.status(200).json(newPost)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    @UseGuards(JwtGuard)
    @Post('comment/:postId')
    async addComment(
        @Res() res: Response,
        @Request() req,
        @Param('postId') postId: string,
        @Body() comment: CreateCommentDto,
    ) {
        try {
            const foundPost = await this.postService.addComment(req.user._id, postId, comment);
            res.status(200).json(foundPost)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    @UseGuards(JwtGuard)
    @Delete('comment/:commentId')
    async deleteComment(
        @Res() res: Response,
        @Request() req,
        @Param('commentId') commentId: string
    ) {
        try {
            const deletedComment = await this.postService.deleteComment(commentId, req.user._id);
            res.status(200).json(deletedComment);
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    @UseGuards(JwtGuard)
    @Get('feed/get')
    async getUserFeed(
        @Res() res: Response,
        @Request() req,
    ) {
        try {
            const user = await this.userService.findUserById(req.user._id)
            user.followings.push(user.id);
            const posts = await this.postService.getUsersFeed(user.followings)
            res.status(200).json(posts)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}
