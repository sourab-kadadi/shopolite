import { Test, TestingModule } from '@nestjs/testing';
import { OrderGroupController } from './order-group.controller';

describe('OrderGroup Controller', () => {
  let controller: OrderGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderGroupController],
    }).compile();

    controller = module.get<OrderGroupController>(OrderGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
