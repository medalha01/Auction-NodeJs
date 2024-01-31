import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuctionDto, BidDto } from '../dto/auction.dto';

@Injectable()
export class AuctionsService {
  constructor(private prisma: PrismaService) {}

  // Function to create a new auction
  async create(auctionDto: AuctionDto) {
    return this.prisma.auction.create({
      data: auctionDto,
    });
  }

  // Function to find all auctions
  async findAll() {
    return this.prisma.auction.findMany();
  }

  // Function to find an auction by its ID
  async findById(id: string) {
    return this.prisma.auction.findUnique({
      where: { id },
    });
  }

  // Function to find auctions by brand
  async findByBrand(brand: string) {
    return this.prisma.auction.findMany({
      where: { brand },
    });
  }

  // Function to find auctions by model
  async findByModel(model: string) {
    return this.prisma.auction.findMany({
      where: { model },
    });
  }

  // Function to find auctions by year
  async findByYear(year: number) {
    return this.prisma.auction.findMany({
      where: { year },
    });
  }

  // Function to find auctions by the ID of their creator
  async findByCreatorId(creatorId: string) {
    return this.prisma.auction.findMany({
      where: { creatorId },
    });
  }

  // Function to update an auction
  async updateAuction(id: string, auctionDto: AuctionDto) {
    return this.prisma.auction.update({
      where: { id },
      data: auctionDto,
    });
  }

  // Function to delete an auction
  async deleteAuction(id: string) {
    return this.prisma.auction.delete({
      where: { id },
    });
  }

  // Function to create a new bid
  async CreateBid(bidDto: BidDto) {
    return this.prisma.bid.create({
      data: bidDto,
    });
  }

  // Function to find bids by auction ID
  async FindBidsByAuctionId(auctionId: string) {
    return this.prisma.bid.findMany({
      where: { auctionId },
    });
  }

  // Function to find bids by user ID
  async FindBidsByUserId(userId: string) {
    return this.prisma.bid.findMany({
      where: { userId },
    });
  }

  // Function to delete a bid
  async deleteBid(id: string) {
    return this.prisma.bid.delete({
      where: { id },
    });
  }

  // Function to update a bid
  async updateBid(id: string, bidDto: BidDto) {
    return this.prisma.bid.update({
      where: { id },
      data: bidDto,
    });
  }

  // Function to aggregate the total bid amount for an auction
  async bidAmountByAuctionId(auctionId: string) {
    return this.prisma.bid.aggregate({
      _sum: {
        amount: true,
      },
      where: { auctionId },
    });
  }

  // Function to find the highest and lowest bids for an auction
  async findHighestBidByAuctionId(auctionId: string) {
    return this.prisma.bid.findFirst({
      where: { auctionId },
      orderBy: { amount: 'desc' },
    });
  }

  async findLowestBidByAuctionId(auctionId: string) {
    return this.prisma.bid.findFirst({
      where: { auctionId },
      orderBy: { amount: 'asc' },
    });
  }
  // Function to find auctions ordered by their end date
  async findOrderedAuctionsByDate() {
    return this.prisma.auction.findMany({
      orderBy: { auctionEndDate: 'asc' },
    });
  }
  /*
  async findWinningUserByAuctionId(auctionId: string) {
    return this.prisma.user.findFirst({
      where: {
        bids: {
          some: {
            auctionId,
          },
        },
      },
    });
    */
}
