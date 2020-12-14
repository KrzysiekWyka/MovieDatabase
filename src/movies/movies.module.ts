import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { OmdbModule } from '../omdb/omdb.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { MovieModel } from './movie.model';

@Module({
  imports: [TypegooseModule.forFeature([MovieModel]), OmdbModule],
  providers: [MoviesService],
  controllers: [MoviesController],
})
export class MoviesModule {}
