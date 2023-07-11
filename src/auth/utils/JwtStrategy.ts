/* eslint-disable prettier/prettier */
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request.cookies['jwt'];
                }
            ]),
            ignoreExpiration: false,
            secretOrKey: 'tinIT28',
        });
    }

    async validate(payload: any) {
        return { ...payload.user }
    }
}