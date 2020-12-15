import * as utils from '../common/test.utils';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { UserModel } from './user.model';
import { UsersRepository } from './users.repository';
import { Provider } from '@nestjs/common';
import { getModelToken } from 'nestjs-typegoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MovieModel } from '../movies/movie.model';
import { Types } from 'mongoose';
import * as _ from 'lodash';

describe('UsersRepository', () => {
  let helpers: utils.Helpers;
  let model: ReturnModelType<typeof UserModel>;
  let sut: UsersRepository;

  beforeAll(async () => {
    await utils.initDBConnection();

    model = await utils.getMongooseModel(UserModel, 'testusers');

    helpers = utils.getHelpers<UserModel>(model);
  });

  beforeEach(async () => {
    await helpers.deleteAll();

    const fakeModel: Provider = {
      provide: getModelToken('UserModel'),
      useValue: model,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [fakeModel, UsersRepository],
    }).compile();

    sut = module.get<UsersRepository>(UsersRepository);
  });

  const createSampleUser = () =>
    helpers.save({
      name: 'foo',
      internalId: Number.MAX_SAFE_INTEGER,
      username: 'fooBar',
      password: 'barFoo',
    });

  afterAll(async () => utils.closeDBConnection(MovieModel));

  describe('findOneByUsername', () => {
    it('should return null when specified user could not be found', async () => {
      const result = await sut.findOneByUsername('notExistingUsername');

      expect(result).toBeNull();
    });

    it('should return specified user', async () => {
      const user = await createSampleUser();

      const result = await sut.findOneByUsername(user.username);

      expect(result).toEqual(user);
    });
  });

  describe('findOneById', () => {
    let insertedUser: DocumentType<UserModel>;

    beforeEach(async () => {
      insertedUser = await createSampleUser();
    });

    it('should return null when specified user could not be found', async () => {
      const result = await sut.findOneById(new Types.ObjectId().toString());

      expect(result).toBeNull();
    });

    it('should return user specified by id', async () => {
      const result = await sut.findOneById(insertedUser._id.toString());

      expect(result).toEqual(insertedUser);
    });

    it('should return only username & _id specified user', async () => {
      const fields = ['username', '_id'];

      const result = await sut.findOneById(
        insertedUser._id.toString(),
        fields.join(' '),
      );

      expect(result).toEqual(_.pick(result, fields));
    });
  });

  describe('incrementUserMovieLimit', () => {
    let insertedUser: DocumentType<UserModel>;

    beforeEach(async () => {
      insertedUser = await createSampleUser();
    });

    it('should skip update when user with specified id could not be found', async () => {
      await sut.incrementUserMovieLimit(new Types.ObjectId().toString());

      const dbResult = await helpers.findMany({});

      expect(dbResult).toEqual([insertedUser]);
    });

    it('should increment addedMoviesInMonthCount and set lastMovieAddedAt to now last value', async () => {
      await sut.incrementUserMovieLimit(insertedUser._id.toString());

      const dbResult = await helpers.findMany({});

      const expectedValue = insertedUser.addedMoviesInMonthCount + 1;

      expect(dbResult).toEqual([
        {
          ...insertedUser,
          addedMoviesInMonthCount: expectedValue,
          lastMovieAddedAt: expect.any(Date),
        },
      ]);
    });
  });

  describe('updateUserById', () => {
    let insertedUser: DocumentType<UserModel>;

    beforeEach(async () => {
      insertedUser = await createSampleUser();
    });

    it('should skip update when specified user could not be found', async () => {
      await sut.updateUserById(new Types.ObjectId().toString(), {
        name: 'fooBar',
      });

      const dbResult = await helpers.findMany({});

      expect(dbResult).toEqual([insertedUser]);
    });

    it('should update specified user', async () => {
      const newName = 'name123';

      await sut.updateUserById(insertedUser._id.toString(), {
        name: newName,
      });

      const dbResult = await helpers.findMany({});

      expect(dbResult).toEqual([{ ...insertedUser, name: newName }]);
    });
  });
});
