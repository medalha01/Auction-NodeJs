import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuctionsService } from './auction.service';
import { AuctionsController } from './auction.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule
      inject: [ConfigService], // Inject ConfigService
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Use environment variable
        signOptions: { expiresIn: '60m' },
      }),
    }),
  ],
  controllers: [AuctionsController],
  providers: [AuctionsService, PrismaService, JwtStrategy],
  exports: [AuctionsService],
})
export class AuctionsModule {}
