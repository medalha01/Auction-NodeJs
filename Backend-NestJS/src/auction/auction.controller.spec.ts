import { Test, TestingModule } from '@nestjs/testing';
import { AuctionService } from 'auction.service';
import { AuctionController } from 'auction.controller';
import { mockAuction, mockBids } from './mocks';

describe('AuctionController', () => {
  let auctionController: AuctionController;
  let auctionService: AuctionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuctionController],
      providers: [
        {
          provide: AuctionService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockAuction]),
            findOne: jest.fn().mockResolvedValue(mockAuction),
            create: jest.fn().mockResolvedValue(mockAuction),
            update: jest
              .fn()
              .mockResolvedValue({ ...mockAuction, startingBid: 11000.0 }),
            delete: jest.fn().mockResolvedValue(null),
            // Include other necessary methods
          },
        },
        // ... other providers if any
      ],
    }).compile();

    auctionController = module.get<AuctionController>(AuctionController);
    auctionService = module.get<AuctionService>(AuctionService);
  });

  // Test cases
  it('should be defined', () => {
    expect(auctionController).toBeDefined();
  });

  it('should get a list of auctions', async () => {
    expect(await auctionController.findAll()).toEqual([mockAuction]);
    expect(auctionService.findAll).toHaveBeenCalled();
  });

  it('should get a single auction', async () => {
    expect(await auctionController.findOne('1')).toEqual(mockAuction);
    expect(auctionService.findOne).toHaveBeenCalledWith('1');
  });

  it('should create an auction', async () => {
    expect(await auctionController.create(mockAuction)).toEqual(mockAuction);
    expect(auctionService.create).toHaveBeenCalledWith(mockAuction);
  });

  // More test cases for updating, deleting, and handling bids
});
