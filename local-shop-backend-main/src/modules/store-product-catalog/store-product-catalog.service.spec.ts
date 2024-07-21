import { Test, TestingModule } from '@nestjs/testing';
import { StoreProductCatalogService } from './store-product-catalog.service';

describe('StoreProductCatalogService', () => {
  let service: StoreProductCatalogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoreProductCatalogService],
    }).compile();

    service = module.get<StoreProductCatalogService>(StoreProductCatalogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
