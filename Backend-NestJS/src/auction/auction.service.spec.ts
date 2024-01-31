import { Test, TestingModule } from '@nestjs/testing';
import { AuctionsService } from './auction.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuctionDto, BidDto } from '../dto/auction.dto';

// Mock Prisma service
const mockPrismaService = {
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
};

describe('AuctionsService', () => {
  let service: AuctionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuctionsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AuctionsService>(AuctionsService);
  });

  // Tests Cases!
});
