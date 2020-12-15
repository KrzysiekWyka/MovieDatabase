import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { ForbiddenException, Provider } from '@nestjs/common';
import usersConfig from './users.config';
import { when } from 'jest-when';
import { UserPlan } from './user-plan.enum';

const BASIC_PLAN_MONTHLY_LIMIT = 5;
const ONE_MONTH_IN_MS = 2629800000;

describe('UsersService', () => {
  let usersRepository: Partial<Record<keyof UsersRepository, jest.Mock>>;
  let sut: UsersService;

  beforeEach(async () => {
    const fakeUsersRepository: Provider = {
      provide: UsersRepository,
      useValue: {
        findOneById: jest.fn(),
        incrementUserMovieLimit: jest.fn(),
        updateUserById: jest.fn(),
      },
    };

    const fakeConfig: Provider = {
      provide: usersConfig.KEY,
      useValue: { basicPlanMonthlyLimit: BASIC_PLAN_MONTHLY_LIMIT },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, fakeUsersRepository, fakeConfig],
    }).compile();

    sut = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository, unknown>(UsersRepository);
  });

  const userId = 'user123';

  describe('checkUserLimitOrThrows', () => {
    it('should throw ForbiddenException when specified user could not be found', async () => {
      await expect(sut.checkUserLimitOrThrows(userId)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should be fulfilled when specified user has premium plan', async () => {
      when(usersRepository.findOneById)
        .calledWith(userId, 'plan addedMoviesInMonthCount lastMovieAddedAt')
        .mockResolvedValueOnce({ plan: UserPlan.PREMIUM });

      await expect(sut.checkUserLimitOrThrows(userId)).resolves.not.toThrow();
      expect(usersRepository.incrementUserMovieLimit).not.toHaveBeenCalled();
    });

    describe('user has basic plan', () => {
      it('should throw ForbiddenException when specified user reach limit & cannot reset counter', async () => {
        when(usersRepository.findOneById)
          .calledWith(userId, 'plan addedMoviesInMonthCount lastMovieAddedAt')
          .mockResolvedValueOnce({
            plan: UserPlan.BASIC,
            addedMoviesInMonthCount: BASIC_PLAN_MONTHLY_LIMIT,
            lastMovieAddedAt: new Date(),
          });

        await expect(sut.checkUserLimitOrThrows(userId)).rejects.toThrow(
          ForbiddenException,
        );
      });

      it('should be fulfilled when user did not reach limit', async () => {
        when(usersRepository.findOneById)
          .calledWith(userId, 'plan addedMoviesInMonthCount lastMovieAddedAt')
          .mockResolvedValueOnce({
            plan: UserPlan.BASIC,
            addedMoviesInMonthCount: BASIC_PLAN_MONTHLY_LIMIT - 1,
          });

        await expect(sut.checkUserLimitOrThrows(userId)).resolves.not.toThrow();
      });

      it('should be fulfilled when user reached limit by in different month', async () => {
        const now = new Date();

        when(usersRepository.findOneById)
          .calledWith(userId, 'plan addedMoviesInMonthCount lastMovieAddedAt')
          .mockResolvedValueOnce({
            plan: UserPlan.BASIC,
            addedMoviesInMonthCount: BASIC_PLAN_MONTHLY_LIMIT,
            lastMovieAddedAt: new Date(now.getTime() - ONE_MONTH_IN_MS),
          });

        await expect(sut.checkUserLimitOrThrows(userId)).resolves.not.toThrow();
      });
    });
  });

  describe('incrementAndResetUserLimitOrThrows', () => {
    it('should skip increment and reset limit process when specified user has premium plan', async () => {
      when(usersRepository.findOneById)
        .calledWith(userId, 'plan addedMoviesInMonthCount lastMovieAddedAt')
        .mockResolvedValueOnce({
          plan: UserPlan.PREMIUM,
          addedMoviesInMonthCount: BASIC_PLAN_MONTHLY_LIMIT - 1,
        });

      const result = await sut.incrementAndResetUserLimitOrThrows(userId);

      expect(result).toBeUndefined();

      expect(usersRepository.updateUserById).not.toHaveBeenCalled();
      expect(usersRepository.incrementUserMovieLimit).not.toHaveBeenCalled();
    });

    it('should reset limit when specified user has last added movie in different month', async () => {
      const now = new Date();

      when(usersRepository.findOneById)
        .calledWith(userId, 'plan addedMoviesInMonthCount lastMovieAddedAt')
        .mockResolvedValueOnce({
          plan: UserPlan.BASIC,
          addedMoviesInMonthCount: BASIC_PLAN_MONTHLY_LIMIT,
          lastMovieAddedAt: new Date(now.getTime() - ONE_MONTH_IN_MS),
        });

      const result = await sut.incrementAndResetUserLimitOrThrows(userId);

      expect(result).toBeUndefined();
      expect(usersRepository.incrementUserMovieLimit).not.toHaveBeenCalled();
      expect(usersRepository.updateUserById).toHaveBeenCalledWith(userId, {
        addedMoviesInMonthCount: 1,
        lastMovieAddedAt: expect.any(Date),
      });
    });

    it('should increment user movie limit when specified user can add movie', async () => {
      when(usersRepository.findOneById)
        .calledWith(userId, 'plan addedMoviesInMonthCount lastMovieAddedAt')
        .mockResolvedValueOnce({
          plan: UserPlan.BASIC,
          addedMoviesInMonthCount: BASIC_PLAN_MONTHLY_LIMIT - 1,
        });

      const result = await sut.incrementAndResetUserLimitOrThrows(userId);

      expect(result).toBeUndefined();
      expect(usersRepository.incrementUserMovieLimit).toHaveBeenCalledWith(
        userId,
      );
      expect(usersRepository.updateUserById).not.toHaveBeenCalled();
    });
  });
});
