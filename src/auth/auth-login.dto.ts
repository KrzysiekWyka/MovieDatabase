import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserModel } from '../users/user.model';

export class AuthLoginDto extends PickType(UserModel, [
  'username',
  'password',
] as const) {}

export class AuthLoginResponseDto {
  @ApiProperty({ description: 'Jwt token' })
  token: string;
}
