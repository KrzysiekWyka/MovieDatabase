import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class IdModel {
  @ApiProperty({ type: String })
  _id?: Types.ObjectId;
}

export abstract class BaseModel extends IdModel {
  @ApiProperty()
  __v?: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt?: Readonly<Date>;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt?: Readonly<Date>;
}
