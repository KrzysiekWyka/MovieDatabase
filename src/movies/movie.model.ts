import { modelOptions, prop } from '@typegoose/typegoose';
import { BaseModel } from '../common/base.model';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@modelOptions({ schemaOptions: { timestamps: true, collection: 'movies' } })
export class MovieModel extends BaseModel {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @prop({ required: true })
  title!: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty()
  @prop({ required: true })
  releasedDate!: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @prop({ required: true })
  genre!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @prop({ required: true })
  directory!: string;
}
