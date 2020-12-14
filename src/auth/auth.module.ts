import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule, forwardRef(() => UsersModule)],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
