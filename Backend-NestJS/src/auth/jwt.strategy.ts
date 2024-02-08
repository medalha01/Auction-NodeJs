// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { UserDto } from 'src/dto/auth.dto';
/**
 * Implements JWT authentication strategy using Passport and JWT.
 * This strategy is responsible for validating JWT tokens in authorization headers
 * and fetching the corresponding user from the database.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  /**
   * Initializes the JWT strategy with configuration options.
   * @param prisma PrismaService for database access.
   * @param configService ConfigService for accessing environment variables.
   */
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Validates a JWT token's payload to authenticate a user.
   * @param payload The JWT token payload.
   * @returns The authenticated user or null if the user does not exist.
   */
  async validate(payload: {
    sub: string;
    email: string;
  }): Promise<UserDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      return null;
    }

    const userData = new UserDto(user.email, user.username, user.id);

    return userData;
  }
}
