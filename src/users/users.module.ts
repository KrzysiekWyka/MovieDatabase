import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModel } from './user.model';

@Module({
  imports: [TypegooseModule.forFeature([UserModel])],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
