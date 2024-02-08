import { HttpException, Injectable, Logger, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto, UserDto } from '../dto/auth.dto';

/**
 * AuthService provides authentication-related features, including user registration,
 * validation, and login, leveraging the PrismaService for database interactions and
 * JwtService for JWT token generation.
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Registers a new user with the provided credentials.
   * @param registerDto The registration data transfer object containing user credentials.
   * @returns The registered user data without the password.
   */
  async register(registerDto: RegisterDto): Promise<Omit<UserDto, 'password'>> {
    const { email, password, username } = registerDto;
    this.logger.log(`Attempting to register user: ${email}`);

    if (await this.getUser(email)) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    return { email: user.email, username: user.username, id: user.id };
  }

  /**
   * Validates user credentials for authentication.
   * @param loginDto The login data transfer object containing user credentials.
   * @returns A UserDto containing user information if validation is successful, or null otherwise.
   */
  async validateUser(loginDto: LoginDto): Promise<UserDto | null> {
    const { email, password } = loginDto;
    const user = await this.getUser(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }

    return new UserDto(user.email, user.username, user.id);
  }

  /**
   * Logs in a user, generating a JWT token if the user is found and the password is valid.
   * @param loginDto The login data transfer object containing user credentials.
   * @returns An object containing the access token.
   */
  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    this.logger.log(`Logging in user: ${loginDto.email}`);

    const user = await this.getUser(loginDto.email);
    if (!user) {
      this.logger.warn(
        `Login attempt failed for non-existent user: ${loginDto.email}`,
      );
      throw new HttpException('Authentication failed', HttpStatus.UNAUTHORIZED);
    }

    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);
    this.logger.log(`User ${user.email} authenticated successfully`);

    return { access_token: token };
  }

  /**
   * Retrieves a user by email.
   * @param email The email of the user to retrieve.
   * @returns A user entity or null if not found.
   */
  private async getUser(email: string) {
    this.logger.debug(`Retrieving user by email: ${email}`);
    return this.prisma.user.findUnique({ where: { email } });
  }
}
