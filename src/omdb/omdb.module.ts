import { HttpModule, Module } from '@nestjs/common';
import { OmdbService } from './omdb.service';
import { ConfigModule } from '@nestjs/config';
import omdbConfig from './omdb.config';

@Module({
  imports: [ConfigModule.forFeature(omdbConfig), HttpModule],
  providers: [OmdbService],
  exports: [OmdbService],
})
export class OmdbModule {}
