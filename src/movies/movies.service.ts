import { Injectable } from '@nestjs/common';
import { OmdbService } from '../omdb/omdb.service';
import { MoviesRepository } from './movies.repository';
import * as _ from 'lodash';
import { UsersService } from '../users/users.service';

@Injectable()
export class MoviesService {
  constructor(
    private readonly omdbService: OmdbService,
    private readonly moviesRepository: MoviesRepository,
    private readonly usersService: UsersService,
  ) {}

  async createMovie(title: string, creatorId: string) {
    await this.usersService.checkUserLimitOrThrows(creatorId);

    const existingMovie = await this.moviesRepository.findOneByTitle(title);

    if (!_.isEmpty(existingMovie)) {
      return existingMovie;
    }

    return this.fetchDataAndUpsert(title, creatorId);
  }

  private async fetchDataAndUpsert(title: string, creatorId: string) {
    const result = await this.omdbService.getMovieInfoByTitle(title);

    await this.usersService.incrementAndResetUserLimitOrThrows(creatorId);

    return this.moviesRepository.createOrUpdate({
      title: result.Title,
      genre: result.Genre,
      director: result.Director,
      releasedDate: new Date(result.Released),
    });
  }
}
