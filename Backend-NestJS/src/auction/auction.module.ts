import { Module } from '@nestjs/common';
import { AuctionsService } from './auction.service';
import { AuctionsController } from './auction.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'abc161981',
      signOptions: { expiresIn: '600s' },
    }),
  ],
  controllers: [AuctionsController],
  providers: [AuctionsService, PrismaService, JwtStrategy],
  exports: [AuctionsService],
})
export class AuctionsModule {}
