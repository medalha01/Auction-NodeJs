import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterDto, LoginDto } from '../dto/auth.dto';
import { RateLimit } from 'nestjs-rate-limiter';

/**
 * Controller responsible for authentication-related actions,
 * such as user registration and login.
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  /**
   * Creates an instance of AuthController.
   * @param authService The service handling authentication operations.
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * Registers a new user.
   * @param registerDto The data transfer object for user registration.
   * @returns The result of the registration process.
   */
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    try {
      this.logger.log(`Attempting to register user: ${registerDto.email}`);
      const result = await this.authService.register(registerDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'User successfully registered',
        data: result,
      };
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`, error.stack);
      throw new HttpException(
        'Registration failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Authenticates a user and generates a JWT token.
   * @param loginDto The data transfer object for user login.
   * @returns The login result including the JWT token.
   */
  @UseGuards(LocalAuthGuard)
  @RateLimit({
    keyPrefix: 'login',
    points: 5,
    duration: 60,
    errorMessage: 'Too many login attempts. Please try again later.',
  })
  @Post('login')
  @ApiOperation({ summary: 'Log in a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully logged in.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    try {
      this.logger.log(`User login attempt: ${loginDto.email}`);
      const result = await this.authService.login(loginDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'User successfully logged in',
        data: { token: result.access_token, id: loginDto.email },
      };
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`, error.stack);
      throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * A test endpoint to demonstrate error handling.
   * @throws {HttpException} Always throws a Forbidden exception.
   */
  @Post('test')
  @ApiOperation({ summary: 'Test endpoint' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async test() {
    this.logger.warn('Test endpoint was called');
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
}
