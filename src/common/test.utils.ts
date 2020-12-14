import * as mongoose from 'mongoose';
import { deleteModelWithClass, getModelForClass, ReturnModelType } from '@typegoose/typegoose';
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types';
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongod = new MongoMemoryServer();

export const initDBConnection = async () => {
  const uri = await mongod.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
};

export const closeDBConnection = async (classModel: any) => {
  deleteModelWithClass(classModel);

  await mongoose.disconnect();
  await mongod.stop();
};

export const getMongooseModel = async (schema: any, collectionName: string, enableTimeStamps = false) => {
  const model = getModelForClass(schema, {
    schemaOptions: { collection: collectionName, timestamps: enableTimeStamps },
  });

  await model.syncIndexes();

  return model;
};

export function getHelpers<T>(model: ReturnModelType<AnyParamConstructor<T>>) {
  return {
    save: async (modelToSave: any) => (await model.create(modelToSave)).toObject(),
    findMany: (filter: any) =>
      model
        .find(filter)
        .lean()
        .exec(),
    deleteAll: () => model.deleteMany({}).exec(),
  };
}

export type Helpers = ReturnType<typeof getHelpers>;
