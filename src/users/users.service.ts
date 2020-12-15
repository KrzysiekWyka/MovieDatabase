import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserPlan } from './user-plan.enum';
import { ConfigType } from '@nestjs/config';
import usersConfig from './users.config';
import * as _ from 'lodash';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(usersConfig.KEY)
    private readonly config: ConfigType<typeof usersConfig>,
  ) {}

  async checkUserLimitOrThrows(userId: string) {
    const user = await this.usersRepository.findOneById(
      userId,
      'plan addedMoviesInMonthCount lastMovieAddedAt',
    );

    if (_.isEmpty(user)) {
      throw new ForbiddenException();
    }

    if (user.plan === UserPlan.PREMIUM) {
      return;
    }

    const canAddNewMovie = this.canUserAddMovie(
      user.lastMovieAddedAt,
      user.addedMoviesInMonthCount,
    );

    if (!canAddNewMovie) {
      throw new ForbiddenException();
    }

    return user;
  }

  async incrementAndResetUserLimitOrThrows(userId: string) {
    const user = await this.checkUserLimitOrThrows(userId);

    if (_.isEmpty(user)) {
      return;
    }

    await this.updateOrIncrementUserMovieLimit(userId, user.lastMovieAddedAt);
  }

  private async updateOrIncrementUserMovieLimit(
    userId: string,
    lastMovieAddedAt: Date,
  ) {
    if (this.shouldResetCounter(lastMovieAddedAt)) {
      await this.usersRepository.updateUserById(userId, {
        addedMoviesInMonthCount: 1,
        lastMovieAddedAt: new Date(),
      });
    } else {
      await this.usersRepository.incrementUserMovieLimit(userId);
    }
  }

  private canUserAddMovie(
    lastMovieAddedAt = new Date(),
    addedMoviesInMonthCount = 0,
  ) {
    const limitWasReached =
      addedMoviesInMonthCount >= this.config.basicPlanMonthlyLimit;

    return !(limitWasReached && !this.shouldResetCounter(lastMovieAddedAt));
  }

  private shouldResetCounter(lastMovieAddedAt = new Date()) {
    const currentMonth = new Date().getMonth();

    return lastMovieAddedAt.getMonth() !== currentMonth;
  }
}
