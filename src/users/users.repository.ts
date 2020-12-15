import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../common/base.repository';
import { UserModel } from './user.model';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { UpdateQuery } from 'mongoose';

@Injectable()
export class UsersRepository extends BaseRepository<UserModel> {
  constructor(
    @InjectModel(UserModel) userModel: ReturnModelType<typeof UserModel>,
  ) {
    super(userModel);
  }

  findOneByUsername(username: string) {
    return this.mongooseModel
      .findOne({ username: username })
      .lean()
      .exec();
  }

  findOneById(id: string, select?: string) {
    return this.mongooseModel
      .findById(id, select)
      .lean()
      .exec();
  }

  incrementUserMovieLimit(id: string) {
    return this.mongooseModel
      .updateOne(
        { _id: BaseRepository.toObjectId(id) },
        {
          $inc: { addedMoviesInMonthCount: 1 },
          lastMovieAddedAt: new Date(),
        },
      )
      .exec();
  }

  updateUserById(id: string, model: UpdateQuery<UserModel>) {
    return this.mongooseModel
      .updateOne({ _id: BaseRepository.toObjectId(id) }, model)
      .exec();
  }
}
