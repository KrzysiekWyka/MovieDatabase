import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedDto {
  @ApiProperty({
    type: 'integer',
    example: HttpStatus.UNAUTHORIZED,
    enum: [HttpStatus.UNAUTHORIZED],
  })
  statusCode: HttpStatus.UNAUTHORIZED;

  @ApiProperty()
  message: string;
}
