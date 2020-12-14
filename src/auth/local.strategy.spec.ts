import { LocalStrategy } from './local.strategy';
import { Provider, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { when } from 'jest-when';

describe('LocalStrategy', () => {
  let authService: Partial<Record<keyof AuthService, jest.Mock>>;
  let sut: LocalStrategy;

  beforeEach(async () => {
    const fakeAuthService: Provider = {
      provide: AuthService,
      useValue: { validateUser: jest.fn() },
    };

    const module = await Test.createTestingModule({
      imports: [PassportModule],
      providers: [fakeAuthService, LocalStrategy],
    }).compile();

    sut = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService, unknown>(AuthService);
  });

  describe('validate', () => {
    const username = 'fooBar';
    const password = 'barFoo';

    it('should return UnauthorizedException when specified user could not be validated', async () => {
      await expect(sut.validate(username, password)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.validateUser).toHaveBeenCalledWith(username, password);
    });

    it('should return specified user when was found', async () => {
      const returnedUser = {
        _id: 'user123',
        username: username,
        password: password,
      };

      when(authService.validateUser)
        .calledWith(username, password)
        .mockResolvedValueOnce(returnedUser);

      const result = await sut.validate(username, password);

      expect(result).toBe(returnedUser);
    });
  });
});
