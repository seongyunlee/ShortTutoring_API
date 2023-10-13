import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({
    description: '이벤트 다이렉트 링크',
    example: 'https://w8385.notion.site/132a4ac5896d4b1f82aa1eba98784383?pvs=4',
  })
  url: string;

  @ApiProperty({
    description: 'base64 이벤트 배너 이미지',
    example:
  })
  image: string;
}