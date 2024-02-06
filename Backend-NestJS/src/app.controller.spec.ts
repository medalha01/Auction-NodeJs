import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { mockJwtService } from './mocks/services.mock';
import { JwtService } from '@nestjs/jwt';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: JwtService,
          useFactory: mockJwtService,
        },
      ], // You may need to add the necessary providers here
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getProtectedRoute', () => {
    it('should return a message and user information', () => {
      const mockUser = {}; // Create a mock user object for testing
      const mockRequest = { user: mockUser }; // Create a mock request object with the mock user
      const result = appController.getProtectedRoute(mockRequest);
      expect(result).toEqual({
        message: 'You have accessed a protected route!',
        user: mockUser,
      });
    });
  });
});
