// src/auth/local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, UserDto } from 'src/dto/auth.dto';

/**
 * Implements authentication strategy using Passport's local strategy.
 * This strategy is used for authenticating users based on email and password.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  /**
   * Injects the AuthService to use its validateUser method for authentication.
   * @param authService The authentication service to validate user credentials.
   */
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  /**
   * Validates a user's login credentials.
   * @param email The user's email address.
   * @param password The user's password.
   * @returns The validated user object or throws an UnauthorizedException if validation fails.
   */
  async validate(email: string, password: string): Promise<{ user: UserDto }> {
    const credentials: LoginDto = { email, password };
    const user: UserDto = await this.authService.validateUser(credentials);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { user };
  }
}
