import { Test, TestingModule } from '@nestjs/testing';
import { NotificationTokenController } from './notification-token.controller';

describe('NotificationToken Controller', () => {
  let controller: NotificationTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationTokenController],
    }).compile();

    controller = module.get<NotificationTokenController>(NotificationTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
