/* eslint-disable prettier/prettier */
import { PassportSerializer } from "@nestjs/passport";
import { Inject, Injectable } from '@nestjs/common';
import { AuthService } from "../auth.service";

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(
        @Inject('AUTH_SERVICE') private readonly authService: AuthService,
    ) {
        super();
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    serializeUser(user: any, done: Function) {
        console.log('Serializer User');
        done(null, user);
    }


    // eslint-disable-next-line @typescript-eslint/ban-types
    deserializeUser(payload: any, done: Function) {
        const user = this.authService.findUser(payload.id);
        console.log('Deserialize User');
        console.log(user);
        return user ? done(null, user) : done(null, null)
    }
}