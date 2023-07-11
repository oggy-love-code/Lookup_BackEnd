/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './schema/comment.schema';
import mongoose from 'mongoose';
import { CreateCommentDto } from './dto/create-comment-dto';

@Injectable()
export class CommentService {
    constructor(
        @InjectModel(Comment.name) private commentModel: mongoose.Model<Comment>
    ) { }

    async postComment(userId: string, comment: CreateCommentDto) {
        try {
            let newComment = new this.commentModel(comment);
            newComment.author = userId;
            newComment = await newComment.save();
            return newComment;
        } catch (error) {
            throw error
        }
    }

    async deleteComment(commentId: string, userId: string) {
        try {
            const deletedComment = await this.commentModel.findOneAndDelete({
                _id: commentId,
                author: userId,
            });
            return deletedComment;
        } catch (error) {
            throw error
        }
    }

    async deleteCommentByIds(commentIds: any[]) {
        try {
            const deleteComments = await this.commentModel.deleteMany()
                .where('_id')
                .in(commentIds)
                .exec();
        } catch (error) {
            throw error
        }
    }
}
