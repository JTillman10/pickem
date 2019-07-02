import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { JwtRequest } from '../models/jwt-request.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secretKey',
      // secretOrKey: process.env.SECRET || 'secretKey',
    });
  }

  async validate(jwtPayload: JwtRequest) {
    const user = await this.authService.validateUser(jwtPayload.email);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
