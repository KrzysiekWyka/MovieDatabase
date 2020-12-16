import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import authConfig from './auth.config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forFeature(authConfig),
    JwtModule.register({}),
    forwardRef(() => UsersModule),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
