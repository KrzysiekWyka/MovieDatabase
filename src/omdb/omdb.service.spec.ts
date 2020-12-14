import { Test, TestingModule } from '@nestjs/testing';
import { OmdbService } from './omdb.service';
import {
  HttpModule,
  NotFoundException,
  Provider,
  ServiceUnavailableException,
} from '@nestjs/common';
import omdbConfig from '../omdb/omdb.config';
import * as nock from 'nock';

const TEST_API_KEY = 'b2d47b5c';

// INFO: Tests disabled to prevent reaching daily limits
xdescribe('OmdbService', () => {
  let sut: OmdbService;

  beforeEach(async () => {
    const fakeConfig: Provider = {
      provide: omdbConfig.KEY,
      useValue: {
        apiKey: TEST_API_KEY,
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [OmdbService, fakeConfig],
    }).compile();

    sut = module.get<OmdbService>(OmdbService);
  });

  describe('getMovieInfoByTitle', () => {
    it('should throws ServiceUnavailableException when api call faild', async () => {
      const title = 'fooBar';

      nock('http://www.omdbapi.com/')
        .get('/')
        .query({ apiKey: TEST_API_KEY, t: title, type: 'movie' })
        .reply(500);

      await expect(sut.getMovieInfoByTitle(title)).rejects.toThrow(
        ServiceUnavailableException,
      );

      nock.restore();
    });

    it('should throws NotFoundException when movie could not be found', async () => {
      await expect(
        sut.getMovieInfoByTitle('notExistingMovieTitle'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return movie info', async () => {
      const result = await sut.getMovieInfoByTitle('pulp fiction');

      expect(result).toEqual({
        Title: 'Pulp Fiction',
        Year: '1994',
        Rated: 'R',
        Released: '14 Oct 1994',
        Runtime: '154 min',
        Genre: 'Crime, Drama',
        Director: 'Quentin Tarantino',
        Writer:
          'Quentin Tarantino (stories), Roger Avary (stories), Quentin Tarantino',
        Actors: 'Tim Roth, Amanda Plummer, Laura Lovelace, John Travolta',
        Plot:
          'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
        Language: 'English, Spanish, French',
        Country: 'USA',
        Awards: 'Won 1 Oscar. Another 69 wins & 75 nominations.',
        Poster:
          'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
        Ratings: [
          { Source: 'Internet Movie Database', Value: '8.9/10' },
          { Source: 'Rotten Tomatoes', Value: '92%' },
          { Source: 'Metacritic', Value: '94/100' },
        ],
        Metascore: '94',
        imdbRating: '8.9',
        imdbVotes: '1,807,979',
        imdbID: 'tt0110912',
        Type: 'movie',
        DVD: 'N/A',
        BoxOffice: '$107,928,762',
        Production: 'Miramax Films, A Band Apart, Jersey Films',
        Website: 'N/A',
        Response: 'True',
      });
    });
  });
});
