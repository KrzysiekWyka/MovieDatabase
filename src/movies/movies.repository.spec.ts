import * as utils from '../common/test.utils';
import { ReturnModelType } from '@typegoose/typegoose';
import { MovieModel } from './movie.model';
import { Provider } from '@nestjs/common';
import { getModelToken } from 'nestjs-typegoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesRepository } from './movies.repository';
import { Types } from 'mongoose';

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
    director: 'fooBar',
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

  describe('createOrUpdate', () => {
    it('should create new document & return it', async () => {
      const result = await sut.createOrUpdate(sampleMovieModel);

      expect(result).toEqual({
        ...sampleMovieModel,
        _id: expect.any(Types.ObjectId),
        __v: 0,
      });

      const dbItems = await helpers.findMany({});

      expect(dbItems).toEqual([result]);
    });

    it('should update existing document & return it', async () => {
      const insertedMovie = await helpers.save(sampleMovieModel);

      const newDirector = 'director123';

      const result = await sut.createOrUpdate({
        title: insertedMovie.title,
        director: newDirector,
      });

      expect(result).toEqual({
        ...insertedMovie,
        director: newDirector,
      });

      const dbItems = await helpers.findMany({});

      expect(dbItems).toEqual([result]);
    });
  });
});
