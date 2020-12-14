import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../common/base.repository';
import { UserModel } from './user.model';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class UsersRepository extends BaseRepository<UserModel>{
  constructor(@InjectModel(UserModel) userModel: ReturnModelType<typeof UserModel>) {
    super(userModel);
  }

  findOneByUsername(username: string) {
    return this.mongooseModel.findOne({username: username}).lean().exec()
  }
}
