import { Test, TestingModule } from '@nestjs/testing';
import { StoreTypeController } from './storeType.controller';

describe('StoreType Controller', () => {
  let controller: StoreTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreTypeController],
    }).compile();

    controller = module.get<StoreTypeController>(StoreTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
