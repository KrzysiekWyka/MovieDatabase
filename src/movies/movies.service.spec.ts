import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { OmdbService } from '../omdb/omdb.service';
import { MoviesRepository } from './movies.repository';
import { Provider } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { when } from 'jest-when';
import * as _ from 'lodash';

describe('MoviesService', () => {
  let usersService: Partial<Record<keyof UsersService, jest.Mock>>;
  let moviesRepository: Partial<Record<keyof MoviesRepository, jest.Mock>>;
  let omdbService: Partial<Record<keyof OmdbService, jest.Mock>>;
  let sut: MoviesService;

  beforeEach(async () => {
    const fakeUsersService: Provider = {
      provide: UsersService,
      useValue: {
        checkUserLimitOrThrows: jest.fn(),
        incrementAndResetUserLimitOrThrows: jest.fn(),
      },
    };

    const fakeMoviesRepository: Provider = {
      provide: MoviesRepository,
      useValue: { findOneByTitle: jest.fn(), createOrUpdate: jest.fn() },
    };

    const fakeOmdbService: Provider = {
      provide: OmdbService,
      useValue: { getMovieInfoByTitle: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        fakeMoviesRepository,
        fakeOmdbService,
        fakeUsersService,
      ],
    }).compile();

    sut = module.get<MoviesService>(MoviesService);
    moviesRepository = module.get<MoviesRepository, unknown>(MoviesRepository);
    omdbService = module.get<OmdbService, unknown>(OmdbService);
    usersService = module.get<UsersService, unknown>(UsersService);
  });

  describe('createMovie', () => {
    const title = 'fooBar';
    const creatorId = 'creator123';

    it('should return existing movie when specified movie already exists', async () => {
      const existingMovie = {
        title: title,
        _id: 'movie123',
      };

      when(moviesRepository.findOneByTitle)
        .calledWith(title)
        .mockResolvedValueOnce(existingMovie);

      const result = await sut.createMovie(title, creatorId);

      expect(result).toBe(existingMovie);
      expect(usersService.checkUserLimitOrThrows).toHaveBeenCalledWith(
        creatorId,
      );
      expect(omdbService.getMovieInfoByTitle).not.toHaveBeenCalled();
    });

    it('should get info and create movie', async () => {
      const movieInfo = {
        Title: title,
        Genre: 'genre123',
        Director: 'director123',
        Released: new Date().getTime(),
      };

      const insertedMovie = {
        title: title,
        genre: movieInfo.Genre,
        director: movieInfo.Director,
        releasedDate: new Date(movieInfo.Released),
        _id: 'movie123',
      };

      when(omdbService.getMovieInfoByTitle)
        .calledWith(title)
        .mockResolvedValueOnce({ ...movieInfo, foo: 'bar' });

      when(moviesRepository.createOrUpdate)
        .calledWith(_.omit(insertedMovie, '_id'))
        .mockResolvedValueOnce(insertedMovie);

      const result = await sut.createMovie(title, creatorId);

      expect(result).toBe(insertedMovie);
      expect(
        usersService.incrementAndResetUserLimitOrThrows,
      ).toHaveBeenCalledWith(creatorId);
    });
  });
});
