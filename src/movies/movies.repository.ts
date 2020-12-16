import { BaseRepository } from '../common/base.repository';
import { MovieModel } from './movie.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { UpdateQuery } from 'mongoose';

@Injectable()
export class MoviesRepository extends BaseRepository<MovieModel> {
  constructor(
    @InjectModel(MovieModel) movieModel: ReturnModelType<typeof MovieModel>,
  ) {
    super(movieModel);
  }

  findOneByTitle(title: string) {
    return this.mongooseModel
      .findOne({ title: title })
      .lean()
      .exec();
  }

  createOrUpdate(data: UpdateQuery<MovieModel>) {
    return this.mongooseModel
      .findOneAndUpdate({ title: data.title }, data, {
        upsert: true,
        new: true,
      })
      .lean()
      .exec();
  }

  // TODO: Add pagination
  findAll() {
    return this.mongooseModel
      .find({})
      .sort({ createdAt: -1 })
      .exec();
  }
}
