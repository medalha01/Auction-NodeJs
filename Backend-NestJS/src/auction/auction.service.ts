import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuctionDto, BidDto } from '../dto/auction.dto';

@Injectable()
export class AuctionsService {
  constructor(private prisma: PrismaService) {}

  // Create a new auction
  async createAuction(auctionDto: AuctionDto, userId: string) {
    return this.prisma.auction.create({
      data: {
        ...auctionDto,
        creatorId: userId,
      },
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
  async findAuctionByUserId(userId: string) {
    return this.prisma.auction.findMany({
      where: { creatorId: userId },
    });
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
  async validateAuctionAndBid(auction, bidDto) {
    if (!auction) {
      throw new Error('Auction does not exist');
    }
    if (auction.creatorId === bidDto.userId) {
      throw new Error('Bidder is not eligible');
    }
    if (
      auction.auctionEndDate < new Date() ||
      auction.auctionStartDate > new Date()
    ) {
      throw new Error('Auction is not open for bidding');
    }
    if (bidDto.amount <= auction.startingBid) {
      throw new Error('Bid amount must be greater than starting bid');
    }
    const highestBid = await this.findHighestBidByAuctionId(bidDto.auctionId);
    if (highestBid && bidDto.amount <= highestBid.amount) {
      throw new Error('Bid amount must be higher than the current highest bid');
    }
  }
  // Create a new bid
  async createBid(bidDto: BidDto) {
    const auction = await this.findAuctionById(bidDto.auctionId);

    await this.validateAuctionAndBid(auction, bidDto);

    return this.prisma.bid.create({
      data: bidDto,
    });
  }

  async updateBid(id: string, bidDto: BidDto) {
    const auction = await this.findAuctionById(bidDto.auctionId);
    await this.validateAuctionAndBid(auction, bidDto);

    return this.prisma.bid.create({ data: bidDto });
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
