/* eslint-disable prettier/prettier */
import { Injectable, Inject } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject('AUTH_SERVICE') private readonly authService: AuthService
    ) {
        super({
            clientID: '729511384917-bsuvonctr4idv602mpp2pvehnnvsco1s.apps.googleusercontent.com',
            clientSecret: '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',
            callbackURL: 'http://localhost:8000',
            scope: ['profile', 'email'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile) {
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
        const user = await this.authService.validateUser({
            email: profile.emails[0].value,
            name: profile.displayName,
        });
        console.log('Validate');
        console.log(user);
        return user || null;
    }
}