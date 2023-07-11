/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true,
})
export class User {

    @Prop({
        unique: true,
        uniqueCaseInsensitive: true,
        index: true,
        required: true,
        trim: true,
    })
    email: string;

    password: string

    @Prop()
    hashPassword: string

    @Prop()
    image: string[];

    @Prop()
    phoneNumber: string;

    @Prop()
    description: string;

    @Prop()
    name: string;

    @Prop()
    categoryBusiness: string;

    @Prop()
    city: string;

    @Prop()
    district: string;

    @Prop()
    ward: string;

    @Prop()
    address: string;

    @Prop({ type: [String], default: [] })
    followers: string[];

    @Prop({ type: [String], default: [] })
    followings: string[];

}

export const UserSchema = SchemaFactory.createForClass(User);

