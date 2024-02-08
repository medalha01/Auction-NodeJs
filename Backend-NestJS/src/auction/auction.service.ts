import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Auction } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuctionDto, BidDto } from '../dto/auction.dto';

@Injectable()
export class AuctionsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new auction with the provided details, ensuring that the auction dates and starting bid are valid.
   * @param auctionDto The DTO containing auction details.
   * @returns The created auction without sensitive details.
   */
  async createAuction(auctionDto: AuctionDto): Promise<Auction> {
    const { auctionEndDate, auctionStartDate, startingBid } = auctionDto;

    if (auctionEndDate < new Date() || auctionEndDate < auctionStartDate) {
      throw new BadRequestException('Invalid auction dates.');
    }

    if (startingBid <= 0) {
      throw new BadRequestException('Starting bid must be greater than 0.');
    }

    return this.prisma.auction.create({ data: auctionDto });
  }
  /**
   * Finds all auctions.
   *
   * @return {Promise<Auction[]>} The list of all auctions.
   */
  /**
   * Retrieves all auctions.
   * @returns An array of all auctions.
   */
  async findAllAuctions(): Promise<Auction[]> {
    return this.prisma.auction.findMany();
  }

  /**
   * Finds a single auction by its ID.
   * @param id The ID of the auction to find.
   * @returns The found auction.
   * @throws NotFoundException if the auction doesn't exist.
   */
  async findAuctionById(id: string): Promise<Auction> {
    const auction = await this.prisma.auction.findUnique({ where: { id } });
    if (!auction) {
      throw new NotFoundException(`Auction with ID ${id} not found.`);
    }
    return auction;
  }

  /**
   * Finds auctions created by a specific user.
   * @param userId The ID of the user whose auctions to find.
   * @returns An array of auctions created by the user.
   */
  async findAuctionByUserId(userId: string): Promise<Auction[]> {
    return this.prisma.auction.findMany({ where: { creatorId: userId } });
  }

  /**
   * Updates an auction by its ID with new details.
   * @param id The ID of the auction to update.
   * @param auctionDto New details to update the auction with.
   * @returns The updated auction.
   */
  async updateAuction(id: string, auctionDto: AuctionDto): Promise<Auction> {
    await this.findAuctionById(id); // Ensures auction exists and throws NotFoundException if not
    return this.prisma.auction.update({ where: { id }, data: auctionDto });
  }

  /**
   * Deletes an auction by its ID.
   * @param id The ID of the auction to delete.
   * @returns The result of the delete operation.
   */
  async deleteAuction(id: string): Promise<{ deleted: boolean }> {
    await this.findAuctionById(id); // Ensures auction exists and throws NotFoundException if not
    await this.prisma.auction.delete({ where: { id } });
    return { deleted: true };
  }

  /**
   * Finds a bid by its ID.
   *
   * @param {string} id - the ID of the bid
   * @return {Promise<Bid>} the bid with the specified ID
   */
  async findBidById(id: string) {
    const bid = await this.prisma.bid.findUnique({
      where: { id },
    });
    if (!bid) {
      throw new NotFoundException(`Bid with ID ${id} not found`);
    }
    return bid;
  }
  /**
   * Validate the auction and bid.
   *
   * @param {AuctionDto} auction - the auction to validate
   * @param {BidDto} bidDto - the bid to validate
   * @return {Promise<void>} throws an error if validation fails
   */
  async validateAuctionAndBid(auction: AuctionDto, bidDto: BidDto) {
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
  /**
   * Create a bid using the provided BidDto.
   *
   * @param {BidDto} bidDto - The data transfer object for the bid
   * @return {Promise<any>} A promise that resolves to the created bid
   */
  async createBid(bidDto: BidDto) {
    const auction = await this.findAuctionById(bidDto.auctionId);

    await this.validateAuctionAndBid(auction, bidDto);

    return this.prisma.bid.create({
      data: {
        amount: bidDto.amount,
        userId: bidDto.userId,
        auctionId: bidDto.auctionId,
      },
    });
  }

  /**
   * Update a bid for a given auction.
   *
   * @param {string} id - The ID of the auction
   * @param {BidDto} bidDto - The data for the bid
   * @return {Promise<Bid>} The created bid object
   */
  async updateBid(id: string, bidDto: BidDto) {
    const auction = await this.findAuctionById(id);
    await this.validateAuctionAndBid(auction, bidDto);

    return this.prisma.bid.create({ data: bidDto });
  }

  /**
   * Deletes a bid by ID.
   *
   * @param {string} id - The ID of the bid to be deleted
   * @return {Promise<any>} The deleted bid
   */
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
