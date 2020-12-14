import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersRepository } from '../users/users.repository';
import * as _ from 'lodash';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersRepository.findOneByUsername(username);

    if (_.isEmpty(user)) {
      return undefined;
    }

    const isPasswordCorrect = await this.checkPassword(password, user.password);

    return !isPasswordCorrect ? undefined : _.omit(user, 'password');
  }

  private checkPassword(plainPassword: string, hashedPassword: string) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
