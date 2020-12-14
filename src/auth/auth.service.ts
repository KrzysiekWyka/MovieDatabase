import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersRepository } from '../users/users.repository';
import * as _ from 'lodash';
import { UserModel } from '../users/user.model';
import { ConfigType } from '@nestjs/config';
import authConfig from './auth.config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(authConfig.KEY)
    private readonly config: ConfigType<typeof authConfig>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersRepository.findOneByUsername(username);

    if (_.isEmpty(user)) {
      return undefined;
    }

    const isPasswordCorrect = await this.checkPassword(password, user.password);

    return !isPasswordCorrect ? undefined : _.omit(user, 'password');
  }

  async login(user: Pick<UserModel, 'internalId' | 'name' | 'plan'>) {
    return {
      token: this.generateJwtToken({
        userId: user.internalId,
        name: user.name,
        role: user.plan,
      }),
    };
  }

  private generateJwtToken<T extends { userId: number }>(data: T) {
    return this.jwtService.sign(data, {
      secret: this.config.jwt.secret,
      issuer: this.config.jwt.issuer,
      expiresIn: this.config.jwt.ttl,
      subject: `${data.userId}`,
    });
  }

  private checkPassword(plainPassword: string, hashedPassword: string) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
