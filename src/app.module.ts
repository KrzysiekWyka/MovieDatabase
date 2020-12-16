import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { databaseProvider } from './database/database.provider';
import { OmdbModule } from './omdb/omdb.module';
import { MoviesModule } from './movies/movies.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

// TODO: Add config validation

@Module({
  imports: [
    ConfigModule.forRoot(),
    databaseProvider,
    OmdbModule,
    MoviesModule,
    AuthModule,
    UsersModule,
  ],
  providers: [AppService],
})
export class AppModule {}
