/* eslint-disable prettier/prettier */
import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({
    timestamps: true
})
export class Comment {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    author: any;

    @Prop()
    content: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);