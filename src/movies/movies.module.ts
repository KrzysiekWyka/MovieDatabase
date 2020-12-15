import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { OmdbModule } from '../omdb/omdb.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { MovieModel } from './movie.model';
import { MoviesRepository } from './movies.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypegooseModule.forFeature([MovieModel]), OmdbModule, UsersModule],
  providers: [MoviesService, MoviesRepository],
  controllers: [MoviesController],
})
export class MoviesModule {}
