import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { AuctionDto, BidDto } from '../dto/auction.dto';
import { AuctionsService } from './auction.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Post('auction')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new auction' })
  @ApiResponse({
    status: 201,
    description: 'The auction has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: AuctionDto })
  async createAuction(@Body() auctionObject: AuctionDto) {
    return this.auctionsService.createAuction(auctionObject);
  }

  @Get('auction/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get an auction by ID' })
  @ApiResponse({ status: 200, description: 'The auction details.' })
  @ApiResponse({ status: 404, description: 'Auction not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: AuctionDto })
  async findOneAuction(@Param('id') id: string) {
    return this.auctionsService.findAuctionById(id);
  }

  @Get('auction/user/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all auctions by user ID' })
  @ApiResponse({ status: 200, description: 'The auctions details.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: AuctionDto })
  /**
   * Retrieves an auction using the user ID.
   *
   * @param {string} id - The ID of the user
   * @return {Promise<Auction>} The auction found for the user ID
   */
  async getAuctionByUser(@Param('id') id: string) {
    return this.auctionsService.findAuctionByUserId(id);
  }

  @Get('auction/all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all auctions' })
  @ApiResponse({ status: 200, description: 'The auctions details.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: AuctionDto })
  /**
   * Find all items.
   *
   * @return {Promise} The list of all items.
   */
  async findAll() {
    return this.auctionsService.findAllAuctions();
  }

  @Post('auction/update/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an auction' })
  @ApiResponse({ status: 200, description: 'The auction has been updated.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: AuctionDto })
  async update(@Param('id') id: string, @Body() updateAuctionDto: AuctionDto) {
    return this.auctionsService.updateAuction(id, updateAuctionDto);
  }

  @Post('auction/delete/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an auction' })
  @ApiResponse({ status: 200, description: 'The auction has been deleted.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async delete(@Param('id') id: string) {
    return this.auctionsService.deleteAuction(id);
  }

  @Post('bid')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createBid(@Body() bidObject: BidDto) {
    return this.auctionsService.createBid(bidObject);
  }

  @Post('bid/update/:id')
  @UseGuards(JwtAuthGuard)
  async updateBid(@Param('id') id: string, @Body() updateBidDto: BidDto) {
    return this.auctionsService.updateBid(id, updateBidDto);
  }
  @Get('bids/user/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all bids from user' })
  @ApiResponse({ status: 200, description: 'The bids details.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: BidDto })
  async getUserBids(@Param('id') id: string) {
    return this.auctionsService.findAllBidsByBidder(id);
  }

  @Get('bid/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get an bid by ID' })
  @ApiResponse({ status: 200, description: 'The bid details.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: BidDto })
  async getBid(@Param('id') id: string) {
    return this.auctionsService.findBidById(id);
  }
  @Get('bid/auction/:auctionId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all bids from auction' })
  @ApiResponse({ status: 200, description: 'The bids details.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: BidDto })
  async getAllBidsFromAuction(@Param('auctionId') auctionId: string) {
    return this.auctionsService.findBidsByAuctionId(auctionId);
  }

  @Get('bid/highest/:auctionId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get highest bid from auction' })
  @ApiResponse({ status: 200, description: 'The highest bid details.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: BidDto })
  async getHighestBidByAuctionId(auctionId: string) {
    return this.auctionsService.findHighestBidByAuctionId(auctionId);
  }
}
