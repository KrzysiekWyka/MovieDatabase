import mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class IdModel {
  @ApiProperty({ type: String })
  _id?: mongoose.Types.ObjectId;
}

export abstract class BaseModel {
  @ApiProperty()
  __v?: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt?: Readonly<Date>;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt?: Readonly<Date>;
}