export class ResponseDto {
  static readonly Success = new ResponseDto(
    '요청이 성공적으로 완료되었습니다.',
    false,
    null,
    200,
  );

  static readonly Created = new ResponseDto(
    '요청이 성공적으로 완료되었습니다.',
    false,
    null,
    201,
  );

  static readonly BadRequest = new ResponseDto(
    '요청이 잘못되었습니다.',
    true,
    null,
    400,
  );

  static readonly Unauthorized = new ResponseDto(
    '인증이 필요합니다.',
    true,
    null,
    401,
  );

  static readonly Forbidden = new ResponseDto(
    '권한이 없습니다.',
    true,
    null,
    403,
  );

  static readonly NotFound = new ResponseDto(
    '리소스가 존재하지 않습니다.',
    true,
    null,
    404,
  );

  message: string;
  error: boolean;
  data?: object;
  statusCode?: number;

  constructor(
    message: string,
    error: boolean,
    data?: object,
    statusCode?: number,
  ) {
    this.message = message;
    this.error = error;
    this.data = data;
    this.statusCode = statusCode;
  }
}