import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { databaseProvider } from './database/database.provider';
import { OmdbModule } from './omdb/omdb.module';
import { MoviesModule } from './movies/movies.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import * as Joi from '@hapi/joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(3000),
        MONGODB_URI: Joi.string()
          .uri()
          .required(),
        JWT_SECRET: Joi.string().required(),
        OMDB_API_KEY: Joi.string().required(),
      }),
    }),
    databaseProvider,
    OmdbModule,
    MoviesModule,
    AuthModule,
    UsersModule,
  ],
  providers: [AppService],
})
export class AppModule {}
