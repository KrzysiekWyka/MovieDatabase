import { Module } from '@nestjs/common';
import { OmdbService } from './omdb.service';

@Module({
  providers: [OmdbService]
})
export class OmdbModule {}
