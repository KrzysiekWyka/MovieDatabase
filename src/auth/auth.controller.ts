import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthLoginDto, AuthLoginResponseDto } from './auth-login.dto';
import { UnauthorizedDto } from '../common/unauthorized.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ description: 'Login' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Generated token', type: AuthLoginResponseDto })
  @ApiUnauthorizedResponse({
    description: 'Username or password are incorrect',
    type: UnauthorizedDto,
  })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Body() loginDto: AuthLoginDto) {
    return this.authService.login(req.user);
  }
}
