import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'Unique identifier of the user',
    required: false,
  })
  id: string;

  @ApiProperty({ description: 'Username of the user' })
  username: string;

  @ApiProperty({ description: 'Email address of the user' })
  email: string;

  constructor(username: string, email: string, id?: string) {
    this.username = username;
    this.email = email;
    this.id = id;
  }
}

export class AuctionDto {
  @ApiProperty({
    description: 'Unique identifier of the auction',
    required: false,
  })
  id: string;

  @ApiProperty({ description: 'Brand of the item' })
  brand: string;

  @ApiProperty({ description: 'Model of the item' })
  model: string;

  @ApiProperty({ description: 'Year of the item' })
  year: number;

  @ApiProperty({ description: 'Starting bid for the auction' })
  startingBid: number;

  @ApiProperty({
    description: 'Start date and time of the auction',
    type: () => Date,
  })
  auctionStartDate: Date;

  @ApiProperty({
    description: 'End date and time of the auction',
    type: () => Date,
  })
  auctionEndDate: Date;

  @ApiProperty({ description: 'Unique identifier of the auction creator' })
  creatorId: string;

  constructor(
    brand: string,
    model: string,
    year: number,
    startingBid: number,
    auctionStartDate: Date,
    auctionEndDate: Date,
    creatorId: string,
    id?: string,
  ) {
    this.brand = brand;
    this.model = model;
    this.year = year;
    this.startingBid = startingBid;
    this.auctionStartDate = auctionStartDate;
    this.auctionEndDate = auctionEndDate;
    this.creatorId = creatorId;
    this.id = id;
  }
}

export class BidDto {
  @ApiProperty({ description: 'Unique identifier of the bid', required: false })
  id: string;

  @ApiProperty({ description: 'Amount of the bid' })
  amount: number;

  @ApiProperty({
    description: 'Unique identifier of the user who made the bid',
  })
  userId: string;

  @ApiProperty({
    description: 'Unique identifier of the auction for which the bid was made',
  })
  auctionId: string;

  constructor(amount: number, userId: string, auctionId: string, id?: string) {
    this.amount = amount;
    this.userId = userId;
    this.auctionId = auctionId;
    this.id = id;
  }
}
