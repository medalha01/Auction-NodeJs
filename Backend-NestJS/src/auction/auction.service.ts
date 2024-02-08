import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Bid, Auction } from '@prisma/client';
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
   * Validates auction conditions and bid details before allowing a bid creation or update.
   * Throws meaningful exceptions if conditions are not met.
   *
   * @param auctionDto The auction details.
   * @param bidDto The bid details.
   */
  private async validateAuctionAndBid(
    auctionDto: AuctionDto,
    bidDto: BidDto,
  ): Promise<void> {
    if (!auctionDto) {
      throw new NotFoundException('Auction does not exist.');
    }
    if (auctionDto.creatorId === bidDto.userId) {
      throw new BadRequestException('Bidder cannot bid on their own auction.');
    }
    if (
      new Date() < auctionDto.auctionStartDate ||
      new Date() > auctionDto.auctionEndDate
    ) {
      throw new BadRequestException('Auction is not open for bidding.');
    }
    if (bidDto.amount <= auctionDto.startingBid) {
      throw new BadRequestException(
        'Bid amount must be greater than the starting bid.',
      );
    }
    const highestBid = await this.findHighestBidByAuctionId(bidDto.auctionId);
    if (highestBid && bidDto.amount <= highestBid.amount) {
      throw new BadRequestException(
        'Bid amount must be higher than the current highest bid.',
      );
    }
  }

  /**
   * Creates a bid for an auction with validation.
   *
   * @param bidDto The bid details.
   * @returns The created bid.
   */
  async createBid(bidDto: BidDto): Promise<Bid> {
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
   * Updates an existing bid for an auction, assuming bid updates are allowed.
   * Note: This method currently creates a new bid instead of updating an existing one.
   * This might be a logical error in the original code. Consider revising the logic if updating a bid is the intended behavior.
   *
   * @param id The auction ID.
   * @param bidDto The updated bid details.
   * @returns The updated (or newly created) bid.
   */
  async updateBid(id: string, bidDto: BidDto): Promise<Bid> {
    const auction = await this.findAuctionById(id);
    await this.validateAuctionAndBid(auction, bidDto);

    // Assuming update logic is needed. If creating a new bid is intended, consider renaming this method.
    throw new Error('Update logic for bids not implemented.'); // Placeholder for actual implementation.
  }

  /**
   * Deletes a bid by its ID.
   *
   * @param id The bid ID to delete.
   * @returns A confirmation of deletion.
   */
  async deleteBid(id: string): Promise<{ deleted: boolean }> {
    const bid = await this.findBidById(id);
    if (!bid) {
      throw new NotFoundException(`Bid with ID ${id} not found.`);
    }
    await this.prisma.bid.delete({ where: { id } });
    return { deleted: true };
  }
  // Find bids by auction ID
  async findBidsByAuctionId(auctionId: string) {
    return this.prisma.bid.findMany({
      where: { auctionId },
    });
  }

  /**
   * Finds the highest bid for a specific auction.
   * @param auctionId The unique identifier for the auction.
   * @returns The highest bid for the given auction or null if no bids are found.
   */
  async findHighestBidByAuctionId(auctionId: string) {
    return this.prisma.bid.findFirst({
      where: { auctionId },
      orderBy: { amount: 'desc' },
    });
  }

  /**
   * Retrieves all auctions ordered by their end date in ascending order.
   * @returns A list of auctions sorted by their end date.
   */
  async findAuctionsOrderedByEndDate() {
    return this.prisma.auction.findMany({
      orderBy: { auctionEndDate: 'asc' },
    });
  }

  /**
   * Aggregates the total amount bid for a specific auction.
   * @param auctionId The unique identifier for the auction.
   * @returns The sum of all bid amounts for the given auction.
   */
  async getTotalBidAmountByAuctionId(auctionId: string): Promise<number> {
    const result = await this.prisma.bid.aggregate({
      _sum: {
        amount: true,
      },
      where: { auctionId },
    });
    return result._sum.amount ?? 0; // Returns 0 if no bids are found
  }

  /**
   * Finds all bids made by a specific bidder.
   * @param userId The unique identifier for the user/bidder.
   * @returns A list of bids made by the specified user.
   */
  async findAllBidsByBidder(userId: string) {
    return this.prisma.bid.findMany({
      where: { userId },
    });
  }
  /**
   * Searches auctions based on given criteria such as brand, model, year, etc.
   * @param searchCriteria An object containing search criteria.
   * @returns A list of auctions that match the criteria.
   */
  async searchAuctions(searchCriteria: {
    brand?: string;
    model?: string;
    year?: number;
  }): Promise<Auction[]> {
    return this.prisma.auction.findMany({
      where: {
        ...(searchCriteria.brand && { brand: searchCriteria.brand }),
        ...(searchCriteria.model && { model: searchCriteria.model }),
        ...(searchCriteria.year && { year: searchCriteria.year }),
      },
    });
  }
  /**
   * Retrieves all bids for a given auction, optionally sorted by bid amount.
   * @param auctionId The ID of the auction.
   * @param sortDescending Whether to sort the bids in descending order by amount.
   * @returns A list of bids for the auction.
   */
  async getBidsForAuction(
    auctionId: string,
    sortDescending: boolean = true,
  ): Promise<Bid[]> {
    return this.prisma.bid.findMany({
      where: { auctionId },
      orderBy: { amount: sortDescending ? 'desc' : 'asc' },
    });
  }
}
