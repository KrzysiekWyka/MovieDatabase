import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModel } from './user.model';
import { UsersRepository } from './users.repository';
import { ConfigModule } from '@nestjs/config';
import usersConfig from './users.config';

@Module({
  imports: [
    TypegooseModule.forFeature([UserModel]),
    ConfigModule.forFeature(usersConfig),
  ],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
