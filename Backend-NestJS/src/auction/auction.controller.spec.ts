import { Test, TestingModule } from '@nestjs/testing';
import { AuctionsService } from './auction.service';
import { AuctionsController } from './auction.controller';
import { mockAuctions } from '../mocks/auction.mock';

//TODO ADD Mock JWT AUTH
describe('AuctionController', () => {
  let auctionController: AuctionsController;
  let auctionService: AuctionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuctionsController],
      providers: [
        {
          provide: AuctionsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockAuctions]),
            findOne: jest.fn().mockResolvedValue(mockAuctions),
            findFirst: jest.fn().mockResolvedValue(mockAuctions),
            create: jest.fn().mockResolvedValue(mockAuctions),
            update: jest
              .fn()
              .mockResolvedValue({ ...mockAuctions, startingBid: 11000.0 }),
            delete: jest.fn().mockResolvedValue(null),
            // Include other necessary methods
          },
        },
        // ... other providers if any
      ],
    }).compile();

    auctionController = module.get<AuctionsController>(AuctionsController);
    auctionService = module.get<AuctionsService>(AuctionsService);
  });

  // Test cases
  it('should be defined', () => {
    expect(auctionController).toBeDefined();
  });

  it('should get a list of auctions', async () => {
    expect(await auctionController.findAll()).toEqual(mockAuctions);
    expect(auctionService.findAllAuctions).toHaveBeenCalled();
  });

  it('should get a single auction', async () => {
    expect(await auctionController.findOneAuction('1')).toEqual(
      mockAuctions[0],
    );
    expect(auctionService.findAuctionById).toHaveBeenCalledWith('1');
  });

  it('should create an auction', async () => {
    expect(
      await auctionController.createAuction(
        mockAuctions[0],
        mockAuctions[0].creatorId,
      ),
    ).toEqual(mockAuctions[0]);
    expect(auctionService.createAuction).toHaveBeenCalledWith(mockAuctions);
  });

  // More test cases for updating, deleting, and handling bids
});
