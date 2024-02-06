import { mockAuctions } from '../mocks/auction.mock';

const mockJwtService = jest.fn(() => ({
  sign: jest.fn(),
  verify: jest.fn(),
  decode: jest.fn(),
}));

const mockAuctionsService = jest.fn(() => ({
  findAll: jest.fn().mockResolvedValue([mockAuctions]),
  findOne: jest.fn().mockResolvedValue(mockAuctions[0]),
  create: jest.fn().mockResolvedValue(mockAuctions[0]),
  update: jest
    .fn()
    .mockResolvedValue({ ...mockAuctions[0], startingBid: 11000.0 }),
  delete: jest.fn().mockResolvedValue(null),
  findAllAuctions: jest.fn().mockResolvedValue([mockAuctions]),
  findAuctionById: jest.fn().mockResolvedValue(mockAuctions[0]),
  createAuction: jest.fn().mockResolvedValue(mockAuctions[0]),
}));

const mockPrismaService = () => ({
  auction: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  bid: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    aggregate: jest.fn(),
  },
});

export { mockJwtService, mockAuctionsService, mockPrismaService };
