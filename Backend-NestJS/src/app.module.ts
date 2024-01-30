import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';

import { APP_GUARD } from '@nestjs/core';
import { RateLimiterModule, RateLimiterGuard } from 'nestjs-rate-limiter';

@Module({
  imports: [AuthModule, RateLimiterModule],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    { provide: APP_GUARD, useClass: RateLimiterGuard },
  ],
})
export class AppModule {}
