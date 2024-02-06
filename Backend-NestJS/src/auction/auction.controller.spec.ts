import { Test, TestingModule } from '@nestjs/testing';
import { AuctionsService } from './auction.service';
import { AuctionsController } from './auction.controller';
import { mockAuctions } from '../mocks/auction.mock';
import { JwtService } from '@nestjs/jwt';
import { mockJwtService, mockAuctionsService } from '../mocks/services.mock';

describe('AuctionsController', () => {
  let auctionsController: AuctionsController;
  let auctionsService: AuctionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuctionsController],
      providers: [
        AuctionsService,
        {
          provide: AuctionsService,
          useFactory: mockAuctionsService,
        },
        {
          provide: JwtService,
          useFactory: mockJwtService,
        },
        // Additional providers as needed
      ],
    }).compile();

    auctionsController = module.get<AuctionsController>(AuctionsController);
    auctionsService = module.get<AuctionsService>(AuctionsService);
  });

  it('should be defined', () => {
    expect(auctionsController).toBeDefined();
    expect(auctionsService).toBeDefined();
  });

  it('should get a list of auctions', async () => {
    await expect(auctionsController.findAll()).resolves.toEqual([mockAuctions]);
    expect(auctionsService.findAllAuctions).toHaveBeenCalled();
  });

  it('should get a single auction', async () => {
    const auctionId = '1';
    await expect(auctionsController.findOneAuction(auctionId)).resolves.toEqual(
      mockAuctions[0],
    );
    expect(auctionsService.findAuctionById).toHaveBeenCalledWith(auctionId);
  });

  it('should create an auction', async () => {
    const newAuction = mockAuctions[0];
    await expect(auctionsController.createAuction(newAuction)).resolves.toEqual(
      newAuction,
    );
    expect(auctionsService.createAuction).toHaveBeenCalledWith(newAuction);
  });
});
