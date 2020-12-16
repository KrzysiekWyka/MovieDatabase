import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersRepository } from '../users/users.repository';
import { Provider } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { when } from 'jest-when';
import { JwtService } from '@nestjs/jwt';
import { UserPlan } from '../users/user-plan.enum';
import authConfig from '../auth/auth.config';
import { Types } from 'mongoose';

jest.mock('bcryptjs');

const JWT_SECRET = 'fooBar';
const JWT_ISSUER = 'https://google.com/';
const JWT_TTL = Number.MAX_SAFE_INTEGER;

describe('AuthService', () => {
  let jwtService: Partial<Record<keyof JwtService, jest.Mock>>;
  let usersRepository: Partial<Record<keyof UsersRepository, jest.Mock>>;
  let sut: AuthService;

  beforeEach(async () => {
    const fakeUsersRepository: Provider = {
      provide: UsersRepository,
      useValue: { findOneByUsername: jest.fn() },
    };

    const fakeJwtService: Provider = {
      provide: JwtService,
      useValue: { sign: jest.fn() },
    };

    const fakeConfig: Provider = {
      provide: authConfig.KEY,
      useValue: {
        jwt: { secret: JWT_SECRET, issuer: JWT_ISSUER, ttl: JWT_TTL },
      },
    };

    const module = await Test.createTestingModule({
      providers: [AuthService, fakeUsersRepository, fakeJwtService, fakeConfig],
    }).compile();

    sut = module.get<AuthService>(AuthService);
    usersRepository = module.get<UsersRepository, unknown>(UsersRepository);
    jwtService = module.get<JwtService, unknown>(JwtService);
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

  describe('login', () => {
    const loginArgs = {
      _id: new Types.ObjectId(),
      internalId: Number.MAX_SAFE_INTEGER,
      name: 'fooBar',
      plan: UserPlan.BASIC,
    };

    it('should generate jwt token for specified user', async () => {
      const token = 'token123';

      when(jwtService.sign)
        .calledWith(
          {
            sub: loginArgs._id.toString(),
            userId: loginArgs.internalId,
            name: loginArgs.name,
            role: loginArgs.plan,
          },
          {
            secret: JWT_SECRET,
            issuer: JWT_ISSUER,
            expiresIn: JWT_TTL,
          },
        )
        .mockReturnValueOnce(token);

      const result = await sut.login(loginArgs);

      expect(result).toEqual({ token: token });
    });
  });
});
