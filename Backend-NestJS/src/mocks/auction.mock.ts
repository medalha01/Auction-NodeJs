import { AuctionDto } from '../dto/auction.dto';

export const mockAuctions = [
  new AuctionDto(
    'Toyota',
    'Camry',
    2020,
    10000.0,
    new Date('2024-01-01T00:00:00Z'),
    new Date('2024-01-10T00:00:00Z'),
    'creator1',
  ),
  new AuctionDto(
    'Honda',
    'Civic',
    2021,
    15000.0,
    new Date('2024-02-01T00:00:00Z'),
    new Date('2024-02-10T00:00:00Z'),
    'creator2',
  ),
  new AuctionDto(
    'Ford',
    'Mustang',
    2018,
    15000.0,
    new Date('2024-05-01T08:00:00Z'),
    new Date('2024-05-11T16:00:00Z'),
    'user3',
  ),
  new AuctionDto(
    'Tesla',
    'Model 3',
    2021,
    30000.0,
    new Date('2024-06-10T11:00:00Z'),
    new Date('2024-06-20T19:00:00Z'),
    'user4',
  ),
  new AuctionDto(
    'BMW',
    '3 Series',
    2017,
    12000.0,
    new Date('2024-07-15T09:30:00Z'),
    new Date('2024-07-25T17:30:00Z'),
    'user5',
  ),
  // ... other mock auctions
];
