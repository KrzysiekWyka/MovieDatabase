import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { databaseProvider } from './database/database.provider';

// TODO: Add config validation

@Module({
  imports: [ConfigModule.forRoot(), databaseProvider],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
