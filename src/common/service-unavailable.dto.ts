import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export class ServiceUnavailableDto {
  @ApiProperty({
    type: 'integer',
    example: HttpStatus.SERVICE_UNAVAILABLE,
    enum: [HttpStatus.SERVICE_UNAVAILABLE],
  })
  statusCode: HttpStatus.SERVICE_UNAVAILABLE;

  @ApiProperty()
  message: string;
}
