import { ResponseDto } from '../../responseDto';
import { ApiProperty } from '@nestjs/swagger';

export class Success_DeleteRequestDto extends ResponseDto {
  @ApiProperty({
    default: 'Delete request successfully.',
  })
  message: string;

  @ApiProperty({
    default: false,
  })
  error: boolean;

  @ApiProperty({
    default: 200,
  })
  statusCode: number;

  @ApiProperty({
    default: null,
  })
  data: object;
}

export class NotFound_DeleteRequestDto extends ResponseDto {
  @ApiProperty({
    default: 'Request not found.',
  })
  message: string;

  @ApiProperty({
    default: true,
  })
  error: boolean;

  @ApiProperty({
    default: 404,
  })
  statusCode: number;

  @ApiProperty({
    default: null,
  })
  data: object;
}