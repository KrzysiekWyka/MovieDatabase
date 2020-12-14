import * as utils from '../common/test.utils';
import { ReturnModelType } from '@typegoose/typegoose';
import { UserModel } from './user.model';
import { UsersRepository } from './users.repository';
import { Provider } from '@nestjs/common';
import { getModelToken } from 'nestjs-typegoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from './users.module';

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

  afterAll(async () => utils.closeDBConnection(UsersModule));

  describe('findOneByUsername', () => {
    it('should return undefined when specified user could not be found', async () => {
      const result = await sut.findOneByUsername('notExistingUsername');

      expect(result).toBeNull();
    });

    it('should return specified user', async () => {
      const user = await helpers.save({
        username: 'fooBar',
        password: 'barFoo',
      });

      const result = await sut.findOneByUsername(user.username);

      expect(result).toEqual(user);
    });
  });
});
