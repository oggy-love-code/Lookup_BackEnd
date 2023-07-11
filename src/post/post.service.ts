/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';
import { Posts } from './schema/post.schema';
import { CreatePostDto } from './dto/create-post-dto';
import { UpdatePostDto } from './dto/update-post-dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CommentService } from 'src/comment/comment.service';
import { UserService } from '../user/user.service';
import { CreateCommentDto } from 'src/comment/dto/create-comment-dto';
import { PostGateway } from './post.gateway';

@Injectable()
export class PostService {
    constructor(
        @InjectModel(Posts.name) private postModel: mongoose.Model<Posts>,
        private cloudinaryService: CloudinaryService,
        private commentService: CommentService,
        private userService: UserService,
        private postGateway: PostGateway
    ) { }

    async create(userId: string, post: CreatePostDto) {
        try {
            const newPost = new this.postModel(post);
            newPost.user = userId;
            if (newPost.images) {
                newPost.images = (await this.cloudinaryService.convertImagesCloudinary(newPost.images));
            }
            this.postGateway.handlePostCreated(newPost);
            return newPost.save();
        } catch (error) {
            throw error
        }
    }

    async getUserDetail(userId: string) {
        const user = await this.userService.findUserNameById(userId);
        return user;
    }

    async getAll() {
        const posts = await this.postModel.find()
            .populate('user', 'name image')
            .sort({ createdAt: -1 });
        this.postGateway.handleGetPost(posts);
        return posts;
    }

    async getById(id: ObjectId): Promise<Posts> {
        const post = await this.postModel.findById(id).populate('comments', 'content').populate('user', 'name image');
        this.postGateway.handleGetPostById(post)
        return post;
    }

    async update(postId: string, post: UpdatePostDto, userId: string) {
        try {
            const foundPost = await this.postModel.findOne({
                _id: postId,
                user: userId,
            });
            foundPost.content = post.content || foundPost.content;

            if (post.images && foundPost.images !== post.images) {
                foundPost.images = (await this.cloudinaryService.convertImagesCloudinary(post.images));
            }
            return await foundPost.save();
        } catch (error) {
            throw error;
        }
    }

    async delete(postId: string, userId: string) {
        try {
            const foundPost = await this.postModel.findById(postId);
            const deleteComments = this.commentService.deleteCommentByIds(foundPost.comments);
            const deletePost = await this.postModel.findOneAndDelete({
                _id: postId,
                user: userId,
            });
            return deletePost;
        } catch (error) {
            throw error;
        }
    }

    async likePost(postId: string, userId: string) {
        try {
            const foundPost = await this.postModel.findById(postId);
            if (!foundPost.likes.includes(userId)) {
                const updatedPost = await foundPost.updateOne({
                    $push: { likes: userId },
                });
                this.postGateway.handlePostLiked(updatedPost);
                return updatedPost;
            } else {
                throw Error('You already like post!')
            }
        } catch (error) {
            throw error
        }
    }

    async unlikePost(postId: string, userId: string) {
        try {
            const foundPost = await this.postModel.findById(postId);
            if (foundPost.likes.includes(userId)) {
                const updatedPost = await foundPost.updateOne({
                    $pull: { likes: userId },
                });

                const post = await this.postModel.findById(postId)
                    .populate('user')
                    .populate({
                        path: 'comments',
                        populate: 'user',
                    });
                this.postGateway.handlePostDisliked(post);
                return post;
            } else {
                throw Error('You are already disliking this post!');
            }
        } catch (error) {
            throw error;
        }
    }

    async addComment(userId: string, postId: string, comment: CreateCommentDto) {
        try {
            const foundPost = await this.postModel.findById(postId);
            const newComment = await this.commentService.postComment(userId, comment);
            const updatedPost = await foundPost.updateOne({
                $push: { comments: newComment._id }
            });
            this.postGateway.handlePostAddComment(newComment);
            return newComment;
        } catch (error) {
            throw error
        }
    }

    async deleteComment(commentId: string, userId: string) {
        try {
            const deletedComment = await this.commentService.deleteComment(commentId, userId);
            return deletedComment;
        } catch (error) {
            throw error
        }
    }

    async getUserProfilePosts(userId: string): Promise<any[]> {
        try {
            const posts = await this.postModel.find({ user: userId })
                .populate('user')
                .populate({
                    path: 'comments',
                    populate: 'author',
                })
                .sort({ createdAt: -1 })
                .exec();
            return posts;
        } catch (error) {
            throw error;
        }
    }

    async getPost(postId: string) {
        try {
            const post = await this.postModel.findById(postId)
                .populate('user')
                .populate({
                    path: 'comments',
                    populate: 'author'
                });
            return post;
        } catch (error) {
            throw error
        }
    }

    async getUsersFeed(userIds: string[]): Promise<any[]> {
        try {
            const posts = await this.postModel.find()
                .where('user')
                .in(userIds)
                .populate('user')
                .populate({
                    path: 'comments',
                    populate: 'author'
                })
                .sort({ createdAt: -1 })
                .exec();
            return posts
        } catch (error) {
            throw error
        }
    }
}
