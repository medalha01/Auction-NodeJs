import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuctionDto, BidDto } from '../dto/auction.dto';

@Injectable()
export class AuctionsService {
  constructor(private prisma: PrismaService) {}

  // Create a new auction
  async createAuction(auctionDto: AuctionDto) {
    return this.prisma.auction.create({
      data: auctionDto,
    });
  }

  // Find all auctions
  async findAllAuctions() {
    return this.prisma.auction.findMany();
  }

  // Find an auction by ID
  async findAuctionById(id: string) {
    const auction = await this.prisma.auction.findUnique({
      where: { id },
    });
    if (!auction) {
      throw new NotFoundException(`Auction with ID ${id} not found`);
    }
    return auction;
  }

  // Update an auction
  async updateAuction(id: string, auctionDto: AuctionDto) {
    const auction = await this.findAuctionById(id);
    if (!auction) {
      throw new NotFoundException(`Auction with ID ${id} not found`);
    }
    return this.prisma.auction.update({
      where: { id },
      data: auctionDto,
    });
  }

  // Delete an auction
  async deleteAuction(id: string) {
    const auction = await this.findAuctionById(id);
    if (!auction) {
      throw new NotFoundException(`Auction with ID ${id} not found`);
    }
    return this.prisma.auction.delete({
      where: { id },
    });
  }
  async findBidById(id: string) {
    const bid = await this.prisma.bid.findUnique({
      where: { id },
    });
    if (!bid) {
      throw new NotFoundException(`Bid with ID ${id} not found`);
    }
    return bid;
  }
  // Create a new bid
  async createBid(bidDto: BidDto) {
    const auction = await this.findAuctionById(bidDto.auctionId);
    if (bidDto.amount <= auction.startingBid) {
      throw new Error('Bid amount must be greater than starting bid');
    }
    return this.prisma.bid.create({
      data: bidDto,
    });
  }

  async updateBid(id: string, bidDto: BidDto) {
    const bid = await this.findBidById(id);
    if (!bid) {
      throw new NotFoundException(`Bid with ID ${id} not found`);
    }
    // Check if bid amount is greater than previous bid
    if (bidDto.amount >= bid.amount) {
      throw new Error('Bid amount must be greater than previous bid');
    }

    return this.prisma.bid.update({
      where: { id },
      data: bidDto,
    });
  }

  async deleteBid(id: string) {
    const bid = await this.findBidById(id);
    if (!bid) {
      throw new NotFoundException(`Bid with ID ${id} not found`);
    }
    return this.prisma.bid.delete({
      where: { id },
    });
  }

  // Find bids by auction ID
  async findBidsByAuctionId(auctionId: string) {
    return this.prisma.bid.findMany({
      where: { auctionId },
    });
  }

  // Find the highest bid for an auction
  async findHighestBidByAuctionId(auctionId: string) {
    return this.prisma.bid.findFirst({
      where: { auctionId },
      orderBy: { amount: 'desc' },
    });
  }

  // Find auctions ordered by end date
  async findAuctionsOrderedByEndDate() {
    return this.prisma.auction.findMany({
      orderBy: { auctionEndDate: 'asc' },
    });
  }

  // Function to aggregate the total bid amount for an auction
  async getTotalBidAmountByAuctionId(auctionId: string) {
    return this.prisma.bid.aggregate({
      _sum: {
        amount: true,
      },
      where: { auctionId },
    });
  }
  async findAllBidsByBidder(userId: string) {
    return this.prisma.bid.findMany({
      where: { userId },
    });
  }
}
