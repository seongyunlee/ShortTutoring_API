import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization;
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const [type, jwt] = token.split(' ') ?? [];
      const user = await this.jwtService.verifyAsync<ActiveUserData>(jwt, {
        secret: process.env.JWT_SECRET_KEY,
      });
      request.headers.userId = user.userId; // TODO: would be removed
      request.user = user;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }

    return true;
  }
}
