import { BaseModel } from '../common/base.model';
import { modelOptions, prop } from '@typegoose/typegoose';
import { UserPlan } from './user-plan.enum';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@modelOptions({ schemaOptions: { timestamps: true, collection: 'users' } })
export class UserModel extends BaseModel {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ type: 'integer' })
  @prop({ required: true })
  internalId!: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @prop({ required: true, unique: true })
  username!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @prop({ required: true })
  password!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @prop({ required: true })
  name!: string;

  @IsEnum(UserPlan)
  @IsOptional()
  @ApiProperty({ enum: UserPlan, default: UserPlan.BASIC })
  @prop({ required: false, default: UserPlan.BASIC })
  plan!: UserPlan;
}
