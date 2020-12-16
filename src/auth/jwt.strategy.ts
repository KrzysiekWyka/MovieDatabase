import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigType } from '@nestjs/config';
import authConfig from './auth.config';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(authConfig.KEY)
    private readonly config: ConfigType<typeof authConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.secret,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub };
  }
}
