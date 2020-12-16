import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
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
import { UnauthorizedDto } from '../common/dtos/unauthorized.dto';
import { ForbiddenDto } from '../common/dtos/forbidden.dto';
import { NotFoundDto } from '../common/dtos/not-found.dto';
import { ServiceUnavailableDto } from '../common/dtos/service-unavailable.dto';
import { CreateMovieDto } from './create-movie.dto';
import { MoviesRepository } from './movies.repository';

@ApiBearerAuth()
@ApiTags('movies')
@UseGuards(AuthGuard('jwt'))
@Controller('movies')
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly movieRepository: MoviesRepository,
  ) {}

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

  @ApiOperation({ description: 'List movies' })
  @ApiOkResponse({ description: 'Movies', isArray: true, type: MovieModel })
  @ApiUnauthorizedResponse({
    description: 'Username or password are incorrect',
    type: UnauthorizedDto,
  })
  @Get()
  listMovies() {
    return this.movieRepository.findAll();
  }
}
