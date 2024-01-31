export class UserDto {
  username: string;
  email: string;
  auctions: AuctionDto[];
  bids: BidDto[];

  constructor(username: string, email: string) {
    this.username = username;
    this.email = email;
  }
}
export class AuctionDto {
  brand: string;
  model: string;
  year: number;
  startingBid: number;
  auctionStartDate: Date;
  auctionEndDate: Date;
  creatorId: string;
  bids: BidDto[];

  constructor(
    brand: string,
    model: string,
    year: number,
    startingBid: number,
    auctionStartDate: Date,
    auctionEndDate: Date,
    creatorId: string,
  ) {
    this.brand = brand;
    this.model = model;
    this.year = year;
    this.startingBid = startingBid;
    this.auctionStartDate = auctionStartDate;
    this.auctionEndDate = auctionEndDate;
    this.creatorId = creatorId;
  }
}

export class BidDto {
  amount: number;
  userId: string;
  auctionId: string;
  auction: AuctionDto;
  user: UserDto;

  constructor(amount: number, userId: string, auctionId: string) {
    this.amount = amount;
    this.userId = userId;
    this.auctionId = auctionId;
  }
}
