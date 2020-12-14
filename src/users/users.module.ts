import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModel } from './user.model';
import { UsersRepository } from './users.repository';

@Module({
  imports: [TypegooseModule.forFeature([UserModel])],
  providers: [UsersService, UsersRepository],
  exports: [UsersService]
})
export class UsersModule {}
