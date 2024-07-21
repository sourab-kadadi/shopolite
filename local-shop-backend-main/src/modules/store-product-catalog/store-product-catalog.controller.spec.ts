import { Test, TestingModule } from '@nestjs/testing';
import { StoreProductCatalogController } from './store-product-catalog.controller';

describe('StoreProductCatalog Controller', () => {
  let controller: StoreProductCatalogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreProductCatalogController],
    }).compile();

    controller = module.get<StoreProductCatalogController>(StoreProductCatalogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
