import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { MoviesService } from './movies.service';
import { MovieModel } from './movie.model';
import { UnauthorizedDto } from '../common/unauthorized.dto';
import { ForbiddenDto } from '../common/forbidden.dto';
import { NotFoundDto } from '../common/not-found.dto';
import { ServiceUnavailableDto } from '../common/service-unavailable.dto';
import { CreateMovieDto } from './create-movie.dto';

@ApiBearerAuth()
@ApiTags('movies')
@UseGuards(AuthGuard('jwt'))
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiOperation({ description: 'Create movie' })
  @ApiOkResponse({ description: 'Created movie', type: MovieModel })
  @ApiForbiddenResponse({
    description: 'Movie limit reached',
    type: ForbiddenDto,
  })
  @ApiNotFoundResponse({
    description: 'Specified movie could not be found',
    type: NotFoundDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Username or password are incorrect',
    type: UnauthorizedDto,
  })
  @ApiServiceUnavailableResponse({
    description: 'Omdb api error',
    type: ServiceUnavailableDto,
  })
  @Post()
  createMovie(@Req() req, @Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.createMovie(
      createMovieDto.title,
      req.user.userId,
    );
  }
}
