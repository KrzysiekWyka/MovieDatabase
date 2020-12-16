import { PickType } from '@nestjs/swagger';
import { MovieModel } from './movie.model';

export class CreateMovieDto extends PickType(MovieModel, ['title'] as const) {}
