import mongoose from 'mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types';

export abstract class BaseRepository<T> {
  public static readonly UNIQUE_INDEX_ERROR_CODE = 11000;

  protected constructor(
    protected readonly mongooseModel: ReturnModelType<AnyParamConstructor<T>>,
  ) {}

  protected isUniqueErrorIndex(error: any) {
    return (
      error.name === 'MongoError' &&
      error.code === BaseRepository.UNIQUE_INDEX_ERROR_CODE
    );
  }

  static toObjectId(id: string | mongoose.Types.ObjectId) {
    return typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id;
  }
}
