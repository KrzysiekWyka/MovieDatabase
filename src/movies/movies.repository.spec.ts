import * as utils from '../common/test.utils';
import { ReturnModelType } from '@typegoose/typegoose';
import { MovieModel } from './movie.model';
import { Provider } from '@nestjs/common';
import { getModelToken } from 'nestjs-typegoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesRepository } from './movies.repository';
import { Error, Types } from 'mongoose';

describe('MoviesRepository', () => {
  let helpers: utils.Helpers;
  let model: ReturnModelType<typeof MovieModel>;
  let sut: MoviesRepository;

  beforeAll(async () => {
    await utils.initDBConnection();

    model = await utils.getMongooseModel(MovieModel, 'testmovies');

    helpers = utils.getHelpers<MovieModel>(model);
  });

  beforeEach(async () => {
    await helpers.deleteAll();

    const fakeModel: Provider = {
      provide: getModelToken('MovieModel'),
      useValue: model,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [fakeModel, MoviesRepository],
    }).compile();

    sut = module.get<MoviesRepository>(MoviesRepository);
  });

  afterAll(async () => utils.closeDBConnection(MovieModel));

  const sampleMovieModel = {
    title: 'foo',
    releasedDate: new Date(),
    genre: 'bar',
    directory: 'fooBar',
  };

  describe('findOneByTitle', () => {
    it('should return null when specified movie could not be found', async () => {
      const result = await sut.findOneByTitle('notExistingMovieTitle');

      expect(result).toBeNull();
    });

    it('should return specified movie', async () => {
      const insertedMovie = await helpers.save(sampleMovieModel);

      const result = await sut.findOneByTitle(insertedMovie.title);

      expect(result).toEqual(insertedMovie);
    });
  });

  describe('createOne', () => {
    it('should throws ValidationError when provided model is incorrect', async () => {
      await expect(sut.createOne({ foo: 'bar' } as any)).rejects.toThrow(
        Error.ValidationError,
      );
    });

    it('should create new document & return it', async () => {
      const result = await sut.createOne(sampleMovieModel);

      expect(result).toEqual({
        ...sampleMovieModel,
        _id: expect.any(Types.ObjectId),
        __v: 0,
      });

      const dbItems = await helpers.findMany({});

      expect(dbItems).toEqual([result]);
    });
  });
});
