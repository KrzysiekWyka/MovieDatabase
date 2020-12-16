import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export class NotFoundDto {
  @ApiProperty({
    type: 'integer',
    example: HttpStatus.NOT_FOUND,
    enum: [HttpStatus.NOT_FOUND],
  })
  statusCode: HttpStatus.NOT_FOUND;

  @ApiProperty()
  message: string;
}
