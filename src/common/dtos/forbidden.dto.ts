import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export class ForbiddenDto {
  @ApiProperty({
    type: 'integer',
    example: HttpStatus.FORBIDDEN,
    enum: [HttpStatus.FORBIDDEN],
  })
  statusCode: HttpStatus.FORBIDDEN;

  @ApiProperty()
  message: string;
}
