import { Test, TestingModule } from '@nestjs/testing';
import { AuctionsService } from './auction.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { mockAuctions } from '../mocks/auction.mock';
import { mockBids } from '../mocks/bid.mock';

// Mock Prisma service
const mockPrismaService = () => ({
  auction: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  bid: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    aggregate: jest.fn(),
  },
});

describe('AuctionsService', () => {
  let service: AuctionsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuctionsService,
        { provide: PrismaService, useFactory: mockPrismaService },
      ],
    }).compile();

    service = module.get<AuctionsService>(AuctionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a new auction successfully', async () => {
    const auctionDto = mockAuctions[0];
    jest.spyOn(prisma.auction, 'create').mockResolvedValue(auctionDto);

    expect(await service.createAuction(auctionDto)).toEqual(auctionDto);
    expect(prisma.auction.create).toHaveBeenCalledWith({ data: auctionDto });
  });
  // Test for finding all auctions
  it('should retrieve all auctions', async () => {
    jest.spyOn(prisma.auction, 'findMany').mockResolvedValue(mockAuctions);

    const auctions = await service.findAllAuctions();
    expect(auctions).toEqual(mockAuctions);
    expect(prisma.auction.findMany).toHaveBeenCalled();
  });

  // Test for finding an auction by ID
  it('should retrieve an auction by its ID', async () => {
    const auction = mockAuctions[0];
    jest.spyOn(prisma.auction, 'findUnique').mockResolvedValue(auction);

    const foundAuction = await service.findAuctionById(auction.id);
    expect(foundAuction).toEqual(auction);
    expect(prisma.auction.findUnique).toHaveBeenCalledWith({
      where: { id: auction.id },
    });
  });

  // Test for handling NotFoundException
  it('should throw NotFoundException when auction is not found', async () => {
    jest.spyOn(prisma.auction, 'findUnique').mockResolvedValue(null);

    await expect(service.findAuctionById('non-existing-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  // Test for updating an auction
  it('should update an existing auction', async () => {
    const auction = mockAuctions[0];
    const updatedAuction = { ...auction, name: 'Updated Name' };
    jest.spyOn(prisma.auction, 'findUnique').mockResolvedValue(auction);
    jest.spyOn(prisma.auction, 'update').mockResolvedValue(updatedAuction);

    const result = await service.updateAuction(auction.id, updatedAuction);
    expect(result).toEqual(updatedAuction);
    expect(prisma.auction.update).toHaveBeenCalledWith({
      where: { id: auction.id },
      data: updatedAuction,
    });
  });

  // Test for deleting an auction
  it('should delete an auction', async () => {
    const auction = mockAuctions[0];
    jest.spyOn(prisma.auction, 'findUnique').mockResolvedValue(auction);
    jest.spyOn(prisma.auction, 'delete').mockResolvedValue(auction);

    const deletedAuction = await service.deleteAuction(auction.id);
    expect(deletedAuction).toEqual(auction);
    expect(prisma.auction.delete).toHaveBeenCalledWith({
      where: { id: auction.id },
    });
  });
  it('should create a new bid', async () => {
    const bidDto = mockBids[0];
    const auction = mockAuctions.find((a) => a.id === bidDto.auctionId);
    prisma.auction.findUnique.mockResolvedValue(auction);
    jest.spyOn(prisma.auction, 'create').mockResolvedValue(bidDto);

    const result = await service.createBid(bidDto);
    expect(result).toEqual(bidDto);
    expect(prisma.bid.create).toHaveBeenCalledWith({ data: bidDto });
  });

  // 1. Ensure Bid is Not Lower Than the Current Highest Bid
  it('should reject a bid lower than the current highest bid', async () => {
    const bidDto = { ...mockBids[0], amount: 15000.0 }; // Lower than highest bid
    const auctionId = bidDto.auctionId;
    const highestBid = mockBids
      .filter((b) => b.auctionId === auctionId)
      .sort((a, b) => b.amount - a.amount)[0];

    jest.spyOn(prisma.bid, 'findFirst').mockResolvedValue(highestBid);
    jest
      .spyOn(prisma.auction, 'findUnique')
      .mockResolvedValue(mockAuctions.find((a) => a.id === auctionId));

    await expect(service.createBid(bidDto)).rejects.toThrow(
      'Bid amount must be higher than the current highest bid',
    );
  });

  // 2. Validate Bidder's Eligibility
  it('should reject a bid if the bidder is not eligible', async () => {
    const ineligibleBidDto = { ...mockBids[0], bidderId: 'ineligibleBidder' };
    jest
      .spyOn(prisma.auction, 'findUnique')
      .mockResolvedValue(
        mockAuctions.find((a) => a.id === ineligibleBidDto.auctionId),
      );

    await expect(service.createBid(ineligibleBidDto)).rejects.toThrow(
      'Bidder is not eligible',
    );
  });

  // 3. Verify Auction Availability Before Bidding
  it('should reject a bid if the auction is closed', async () => {
    const bidDto = mockBids[0];
    const closedAuction = {
      ...mockAuctions.find((a) => a.id === bidDto.auctionId),
      status: 'closed',
    };
    jest.spyOn(prisma.auction, 'findUnique').mockResolvedValue(closedAuction);

    await expect(service.createBid(bidDto)).rejects.toThrow(
      'Auction is not open for bidding',
    );
  });

  // 4. Test Retrieval of All Bids for a Specific Auction
  it('should retrieve all bids for a specific auction', async () => {
    const auctionId = '1';
    const auctionBids = mockBids.filter((bid) => bid.auctionId === auctionId);
    jest.spyOn(prisma.bid, 'findMany').mockResolvedValue(auctionBids);

    const retrievedBids = await service.findBidsByAuctionId(auctionId);
    expect(retrievedBids).toEqual(auctionBids);
    expect(prisma.bid.findMany).toHaveBeenCalledWith({ where: { auctionId } });
  });

  // 5. Test Retrieval of Bids by Bidder ID
  it('should retrieve all bids made by a specific bidder', async () => {
    const bidderId = 'bidder1';
    const bidderBids = mockBids.filter((bid) => bid.id === bidderId);
    jest.spyOn(prisma.bid, 'findMany').mockResolvedValue(bidderBids);

    const retrievedBids = await service.findAllBidsByBidder(bidderId);
    expect(retrievedBids).toEqual(bidderBids);
    expect(prisma.bid.findMany).toHaveBeenCalledWith({ where: { bidderId } });
  });
});
