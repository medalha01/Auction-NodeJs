import { Test, TestingModule } from '@nestjs/testing';
import { AuctionsService } from './auction.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { mockAuctions } from '../mocks/auction.mock';

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
});
