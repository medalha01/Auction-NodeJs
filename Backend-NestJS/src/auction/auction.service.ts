import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuctionDto, BidDto, UserDto } from '../dto/auction.dto';

@Injectable()
export class AuctionsService {
  constructor(private prisma: PrismaService) {}

  async create(auctionDto: AuctionDto) {
    return this.prisma.auction.create({
      data: {
        ...auctionDto,
      },
    });
  }

  async findAll() {
    return this.prisma.auction.findMany();
  }

  // Additional methods like findById, update, delete can be added here
}
