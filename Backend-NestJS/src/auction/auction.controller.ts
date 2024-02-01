import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuctionDto } from 'src/dto/auction.dto';
import { AuctionsService } from './auction.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Post('/auction/create')
  @UseGuards(JwtAuthGuard)
  async create(@Body() auctionObject: AuctionDto, @Req() req: any) {
    return this.auctionsService.createAuction(auctionObject, req.user.userId);
  }

  @Get('/auction/:id')
  async getAuction(@Req() req: any) {
    return this.auctionsService.findAuctionById(req.params.id);
  }
  @Get('/bids')
  async getUserBids(@Req() req: any) {
    return this.auctionsService.findAllBidsByBidder(req.user.userId);
  }
  @Get('/auction/all')
  async findAll() {
    return this.auctionsService.findAllAuctions();
  }
}
