import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersRepository } from '../users/users.repository';
import { Provider } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { when } from 'jest-when';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let usersRepository: Partial<Record<keyof UsersRepository, jest.Mock>>;
  let sut: AuthService;

  beforeEach(async () => {
    const fakeUsersRepository: Provider = {
      provide: UsersRepository,
      useValue: { findOneByUsername: jest.fn() },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, fakeUsersRepository],
    }).compile();

    sut = module.get<AuthService>(AuthService);
    usersRepository = module.get<UsersRepository, unknown>(UsersRepository);
  });

  describe('validateUser', () => {
    const username = 'fooBar';
    const password = 'barFoo';

    const returnedUser = {
      _id: 'user123',
      username: username,
      password: 'hashedPassword',
    };

    const recordFindOneByUsername = () =>
      when(usersRepository.findOneByUsername)
        .calledWith(username)
        .mockResolvedValueOnce(returnedUser);

    const recordCompare = (isCorrect: boolean) => {
      const compareMock = bcrypt.compare as jest.Mock;

      compareMock.mockResolvedValueOnce(isCorrect);

      return compareMock;
    };

    it('should return undefined when specified user could not be found', async () => {
      const result = await sut.validateUser(username, password);

      expect(result).toBeUndefined();
      expect(usersRepository.findOneByUsername).toHaveBeenCalledWith(username);
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should return undefined when specified user provided wrong password', async () => {
      recordFindOneByUsername();

      const compareMock = recordCompare(false);

      const result = await sut.validateUser(username, password);

      expect(result).toBeUndefined();
      expect(compareMock).toHaveBeenCalledWith(password, returnedUser.password);
    });

    it('should return user without password when provided password is correct', async () => {
      recordFindOneByUsername();

      const compareMock = recordCompare(true);

      const result = await sut.validateUser(username, password);

      const { password: _password, ...restUser } = returnedUser;

      expect(result).toEqual(restUser);
      expect(compareMock).toHaveBeenCalledWith(password, returnedUser.password);
    });
  });
});
