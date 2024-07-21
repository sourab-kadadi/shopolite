import { Test, TestingModule } from '@nestjs/testing';
import { StoreTypeService } from './storeType.service';

describe('StoreTypeService', () => {
  let service: StoreTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoreTypeService],
    }).compile();

    service = module.get<StoreTypeService>(StoreTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
