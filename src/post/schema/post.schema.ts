/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';
import { User } from "src/user/schema/user.schema";

@Schema({
    timestamps: true
})
export class Posts {

    @Prop()
    content: string;

    @Prop()
    images: string[];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: any;

    @Prop({ type: [String], default: [] })
    likes: string[];

    @Prop([
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
            default: [],
        },
    ])
    comments: any[];


}

export const PostsSchema = SchemaFactory.createForClass(Posts);

